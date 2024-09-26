import ProgressBar from "progress";
import figures from "figures";
import {compareImages, logger, ResultCollector} from "refaktor-core";

/**
 * Compares the given configuration object to a predefined reference object.
 * This function is asynchronous and returns a promise that resolves with the comparison result.
 *
 * @param {import("refaktor-core").IPagesConfig} config - The configuration object to be compared.
 * @returns {Promise<ResultCollector>} - A promise that resolves with the comparison result.
 */
export const compare = async (config): Promise<ResultCollector> => {
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