import puppeteer from "puppeteer";
import fs from 'fs';
import ProgressBar from "progress";
import figures from "figures";
import SimpleTable from "cli-simple-table";
import { doesFileExist, getScreenshotOutputConfig, logger } from "refactor-core";

export const getBrowser = async (width, height) => {
    logger.debug('Starting browser');
    return puppeteer.launch({
        headless: true,
        devtools: false,
        dumpio: false,
        defaultViewport: {width: width ?? 1600, height: height ?? 1200},
    });
}

/**
 * Creates a screenshot using the given configuration options.
 * @param {IPagesConfig} config - The configuration options for creating the screenshot.
 * @param {boolean} overwrite - Overwrite existing screenshots
 * @param {'original' | 'compare'} type - Type of screenshots
 */
export const createScreenshots = async (config, overwrite = false, type = 'original') => {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setViewport({width: config.viewport?.[0] ?? 1600, height: config.viewport?.[1] ?? 1200});

    logger.debug(`Taking screenshots of ${config.pages.length} pages on ${config.url}`);

    const bar = logger.level === 'info' ? new ProgressBar(`Taking Screenshots [:bar] ${figures.play} :url`, {
        complete: figures.nodejs,
        incomplete: ' ',
        width: 20,
        total: config.pages.length,
    }) : null;

    const stats = {
        created: 0,
        skipped: 0,
    };

    if (config.setup) {
        logger.debug(`Running custom setup function`);
        await config.setup?.(page);
        logger.debug(`Custom setup complete`);
    }

    for (const index in config.pages) {
        const view = config.pages[index];
        const url = `${config.url}${view.path}`
        bar?.tick({url})
        await takeScreenshotsForEntry(page, config, view, type, overwrite)
        stats.created++;
    }

    bar?.terminate();
    logger.debug(`Generated ${stats.created} screenshots. Skipped ${stats.skipped}`);
    await browser.close();
}

/**
 * @param {import('puppeteer').Page} page
 * @param {IPagesConfig} config
 * @param {IPagesEntry} entry
 * @param {'original'|'compare'} type
 * @param {boolean} overwrite
 */
export const takeScreenshotsForEntry = async (page, config, entry, type, overwrite) => {
    const {file, folder} = getScreenshotOutputConfig(config, entry, type);
    const url = `${config.url}${entry.path}`
    logger.debug(`${figures.play} Generating screenshot for ${url}`);
    await fs.promises.mkdir(folder, {recursive: true});
    if (await doesFileExist(file) && !overwrite) {
        logger.debug(`Skipping`);
        return false
    }

    await takeScreenshot(page, entry, url, file, config.fullpage ?? false);
    return true;
}

/**
 *
 * @param {import('puppeteer').Page} page
 * @param {IPagesEntry} entry
 * @param {string} url
 * @param {string} screenshotFile
 * @param {boolean} fullpage
 */
export const takeScreenshot = async (page, entry, url, screenshotFile, fullpage) => {
    logger.debug(`Visit ${url}`);
    await page.goto(url, {waitUntil: 'networkidle2'});
    if (entry.setup) {
        logger.debug(`Start running custom setup function`);
        await entry.setup?.(page);
        logger.debug(`Custom setup complete`);
    }

    logger.debug(`Taking screenshot and save it to ${screenshotFile}`);
    await page.screenshot({path: screenshotFile, fullPage: fullpage});
}

/**
 *
 * @param {IPagesConfig[]} configs
 * @param {boolean} overwrite
 * @param {'original'|'compare'} type
 */
export const takeScreenshotsForAllConfigs = async (configs, overwrite, type) => {
    const totalPages = configs.reduce((total, config) => total + config.pages.length, 0);

    const bar = logger.level === 'info' ? new ProgressBar(`Taking Screenshots [:bar] :current/:total ETA: :etas ${figures.play} :url`, {
        complete: figures.nodejs,
        incomplete: ' ',
        width: 20,
        total: totalPages,
    }) : null;


    const table = new SimpleTable();
    table.header('Config', 'Path', 'Created');

    for (const configIndexs in configs) {
        const config = configs[configIndexs]
        const browser = await getBrowser();
        const page = await browser.newPage();
        await page.setViewport({width: config.viewport?.[0] ?? 1600, height: config.viewport?.[1] ?? 1200});

        if (config.setup) {
            logger.debug(`Running custom setup function`);
            await config.setup?.(page);
            logger.debug(`Custom setup complete`);
        }

        for (const index in config.pages) {
            const entry = config.pages[index];
            const url = `${config.url}${entry.path}`
            bar?.tick({url})
            const created = await takeScreenshotsForEntry(page, config, entry, type, overwrite)
            table.row(config.id, entry.path, created ? figures.tick : 'Skipped')
        }
        await browser.close()
    }

    bar?.terminate();
    if (logger.level === 'info') {
        console.log(table.toString());
    }
}