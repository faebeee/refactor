import { getConfigOutputFolder, getScreenshotOutputConfig } from "./get-screenshot-file-name.js";
import { PNG } from "pngjs";
import fs from "fs";
import pixelmatch from "pixelmatch";
import path from "path";
import { logger } from "./logger.js";
import { ensureFolder } from "./fs-utils.js";

const MAX_PIXEL_DIFF = 100;

/**
 *
 * @param {IPagesConfig} config
 * @param {(() => void)?} onProgress
 * @param {((pass: boolean, config:IPagesConfig, view: IPagesEntry) => void)?} onResult
 */
export const compareImages = async (config, onProgress, onResult) => {
    logger.debug(`Starting compare screenshots for ${config.id}`);

    const diffFolder = path.join(getConfigOutputFolder(config), 'diff', config.id)
    await ensureFolder(diffFolder);

    for (const index in config.pages) {
        const view = config.pages[index];
        onProgress?.()

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
            }

            onResult?.(pass, config, view)
        } catch (e) {
            onResult?.(false, config, view)
        }
    }

}