import figures from 'figures';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import ProgressBar from 'progress';
import { IFileAdapter } from './file-adapters';
import { logger } from './logger';
import { ResultCollector } from './ResultCollector';
import { IPagesConfig, IScreenshotType } from './types';

const MAX_PIXEL_DIFF = 100;

export class ImageComparer {
  private bar: ProgressBar | null;

  constructor(private fileAdapter?: IFileAdapter) {
    this.bar = logger.level === 'info' ? new ProgressBar(`Comparing [:bar] :current/:total :id`, {
      complete: figures.nodejs,
      incomplete: ' ',
      width: 20,
      total: 0,
    }) : null;
  }

  setFileAdapter(fileAdapter: IFileAdapter) {
    this.fileAdapter = fileAdapter;
  }

  onProgress() {
    this.bar?.tick();
  }


  async compare(config: IPagesConfig,) {
    if (!this.fileAdapter) {
      throw new Error('Fileadapter is missing');
    }
    if (this.bar) {
      this.bar.total = config.pages!.length;
    }
    logger.debug(`Starting compare screenshots for ${ config.id }`);
    const collector = new ResultCollector(config);

    for (const index in config.pages) {
      const view = config.pages[index];
      this.onProgress();

      logger.debug(`Comparing ${ view.id }`);

      if (!await this.fileAdapter.fileExists(config, IScreenshotType.ORIGINAL, `${ view.id }.png`) || !await this.fileAdapter.fileExists(config, IScreenshotType.COMPARE, `${ view.id }.png`)) {
        collector.addResult(view, `${ config.url }${ view.path }`, false, '', '', '');
        return collector;
      }

      const img1 = PNG.sync.read(await this.fileAdapter.readFile(config, IScreenshotType.ORIGINAL, `${ view.id }.png`));
      const img2 = PNG.sync.read(await this.fileAdapter.readFile(config, IScreenshotType.COMPARE, `${ view.id }.png`));
      const { width, height } = img1;
      const diff = new PNG({ width, height });

      try {
        const pixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.2 });
        const pass = pixels <= MAX_PIXEL_DIFF;

        // await this.fileAdapter.deleteFile(config, IScreenshotType.COMPARE, `${ view.id }.png`);
        await this.fileAdapter.writeFile(config, IScreenshotType.DIFF, `${ view.id }.png`, PNG.sync.write(diff));
        collector.addResult(view, `${ config.url }${ view.path }`, pass, '', '', '');

      } catch (e) {
      }
    }
    return collector;
  }
}
