import fs from 'fs/promises';
import ProgressBar from 'progress';
import { Page } from 'puppeteer';
import { getBrowser } from './utils/create-screenshots';
import { IFileAdapter } from './file-adapters';
import { getScreenshotOutputConfig } from './get-screenshot-file-name';
import { logger } from './logger';
import { IPagesConfig, IPagesEntry, IScreenshotType } from './types';

export class ScreenshotGenerator {
  private page: Page | null = null;

  constructor(private fileAdapter: IFileAdapter | null = null) {
  }

  setFileAdapter(fileAdapter: IFileAdapter) {
    this.fileAdapter = fileAdapter;
  }

  async takeScreenshots(config: IPagesConfig, overwrite: boolean, type: IScreenshotType): Promise<void> {
    const browser = await getBrowser();
    this.page = await browser.newPage();
    await this.page.setViewport({
      width: config.viewport?.[0] ?? 1600,
      height: config.viewport?.[1] ?? 1200
    });
    logger.debug(`Taking screenshots of ${ config.pages!.length } pages on ${ config.url }`);

    const bar = logger.level === 'info' ? new ProgressBar(`Taking Screenshots :current/:total [:bar] :percent ETA :etas Elapsed :elapsed`, {
      incomplete: ' ',
      width: 20,
      total: config.pages!.length,
    }) : null;


    const stats = {
      created: 0,
      skipped: 0,
      failed: 0
    };

    if (config.setup) {
      logger.debug(`Running custom setup function`);
      await config.setup?.(this.page);
      logger.debug(`Custom setup complete`);
    }

    for (const index in config.pages) {
      const view = config.pages[index];
      const url = `${ config.url }${ view.path }`;
      bar?.tick({ url });
      // await takeScreenshotsForEntry(this.page, this.config, view, this.type ?? IScreenshotType.ORIGINAL, this.overwrite);
      try {
        await this.takeScreenshotsForEntry(config, view, type, overwrite);
        stats.created++;
      } catch (e) {
        throw e;
        stats.failed++;
      }
    }

    bar?.terminate();
    logger.debug(`Generated ${ stats.created } screenshots. Skipped ${ stats.skipped }. Failed ${ stats.failed }`);
    await browser.close();
    this.page = null;
  }

  private async takeScreenshotsForEntry(config: IPagesConfig, entry: IPagesEntry, type: IScreenshotType, overwrite: boolean) {
    if (!this.page) {
      throw new Error('Missing puppeteer page');
    }
    const { file, folder, fileName } = getScreenshotOutputConfig(config, entry, type);
    const url = `${ config.url }${ entry.path }`;
    logger.debug(`Generating screenshot for ${ url }`);
    await fs.mkdir(folder, { recursive: true });

    if (await this.fileAdapter!.fileExists(config, type, fileName) && !overwrite) {
      logger.debug(`Skipping`);
      return false;
    }

    logger.debug(`Visit ${ url }`);
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 60_000 });
      if (entry.setup) {
        logger.debug(`Start running custom setup function`);
        await entry.setup?.(this.page);
        logger.debug(`Custom setup complete`);
      }

      logger.debug(`Taking screenshot and save it to ${ file }`);
      await this.page.screenshot({ path: file, fullPage: true });

      await this.fileAdapter!.writeFile(config, type, fileName, await fs.readFile(file));
      logger.debug(`Remove folder tmp folder ${ folder }`);
      await fs.rm(folder, { recursive: true, force: true });
      return true;
    } catch {
      return false;
    }
  }
}