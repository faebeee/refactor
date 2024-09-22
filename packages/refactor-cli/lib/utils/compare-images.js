import ProgressBar from "progress";
import figures from "figures";
import { compareImages, logger } from "refaktor-core";

/**
 *
 * @param {IPagesConfig} config
 * @return {Promise<ResultCollector>};
 */
export const compare = async (config) => {
    const bar = logger.level === 'info' ? new ProgressBar(`Comparing [:bar] :current/:total :id`, {
        complete: figures.nodejs,
        incomplete: ' ',
        width: 20,
        total: config.pages.length,
    }) : null;


    const result = await compareImages(config,
        () => {
            bar?.tick();
        },
        (pass, config, entry) => {
        })

    bar?.terminate();

    return result;
}