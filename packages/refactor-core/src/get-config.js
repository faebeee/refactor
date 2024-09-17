import path from "path";
import { logger } from "./logger.js";

/**
 * Asynchronously retrieves a configuration object from a specified file path.
 *
 * @param {string} pathToFile - The file path to the configuration file.
 * @returns {Promise<Array<IPagesConfig>>} - A promise that resolves to the retrieved config object.
 */
export const getConfig = async (pathToFile) => {
    const file = path.resolve(process.cwd(), pathToFile);
    logger.debug(`Loading configuration from ${file}`)
    const config = await import(file);
    logger.debug(`Config ${config.default.id} loaded`)
    return config.default;
}