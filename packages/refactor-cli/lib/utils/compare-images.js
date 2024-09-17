import ProgressBar from "progress";
import figures from "figures";
import SimpleTable from "cli-simple-table";
import { compareImages, logger } from "refactor-core";

const MAX_PIXEL_DIFF = 100;

/**
 *
 * @param {IPagesConfig} config
 */
export const compare = async (config) => {
    const table = new SimpleTable();
    table.header('Config', 'Page', 'Status');

    const bar = logger.level === 'info' ? new ProgressBar(`Comparing [:bar] :current/:total :id`, {
        complete: figures.nodejs,
        incomplete: ' ',
        width: 20,
        total: config.pages.length,
    }) : null;


    logger.debug(`Starting compare screenshots for ${config.id}`);
    await compareImages(config,
        () => {
            bar.tick();
        },
        (pass, config, entry) => {
            if (!pass) {
                table.row(config.id, entry.id, figures.cross)
            }
        })

    bar?.terminate();

    if (logger.level === 'info') {
        console.log(table.toString());
    }
}