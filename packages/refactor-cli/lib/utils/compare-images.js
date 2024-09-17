import { getConfigOutputFolder, getScreenshotOutputConfig } from "./get-screenshot-file-name.js";
import { PNG } from "pngjs";
import fs from "fs";
import pixelmatch from "pixelmatch";
import path from "path";
import ProgressBar from "progress";
import figures from "figures";
import { logger } from "./logger.js";
import { cleanupFolder, ensureFolder } from "./fs-utils.js";
import SimpleTable from "cli-simple-table";

const MAX_PIXEL_DIFF = 100;

/**
 *
 * @param {PagesConfig} config
 */
export const compareImages = async (config) => {
    logger.debug(`Starting compare screenshots for ${config.id}`);

    const table = new SimpleTable();
    table.header('Config', 'Page', 'Status', 'Diff');


    const bar = logger.level === 'info' ? new ProgressBar(`Comparing [:bar] :current/:total :id`, {
        complete: figures.nodejs,
        incomplete: ' ',
        width: 20,
        total: config.pages.length,
    }) : null;
    const diffFolder = path.join(getConfigOutputFolder(config), 'diff', config.id)
    const compareFolder = path.join(getConfigOutputFolder(config), 'compare', config.id)
    await ensureFolder(diffFolder);

    for (const index in config.pages) {
        const view = config.pages[index];
        bar?.tick({
            id: view.id
        });

        const original = getScreenshotOutputConfig(config, view, 'original');
        const compare = getScreenshotOutputConfig(config, view, 'compare');

        logger.debug(`Comparing ${view.id}`);

        const img1 = PNG.sync.read(fs.readFileSync(original.file));
        const img2 = PNG.sync.read(fs.readFileSync(compare.file));
        logger.debug(`Original ${img1.width}x${img1.height} ${original.file}`);
        logger.debug(`Compare ${img2.width}x${img2.height} ${compare.file}`);
        const {width, height} = img1;
        const diff = new PNG({width, height});

        try {
            const pixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.2});
            const diffFile = path.join(diffFolder, `${view.id}.png`);
            const pass = pixels <= MAX_PIXEL_DIFF

            if (!pass) {
                fs.writeFileSync(diffFile, PNG.sync.write(diff));
                logger.debug(`${figures.cross} Diff detected ${diffFile}`)
            } else {
                logger.debug(`${figures.tick} ${view.id} unchanged`)
            }

            table.row(config.id, view.id, pass ? figures.tick : figures.cross, diffFile);
        } catch (e) {
            table.row(config.id, view.id, figures.cross, e.message);
        }
    }
    bar?.terminate();

    if (logger.level === 'info') {
        console.log(table.toString());
    }
}