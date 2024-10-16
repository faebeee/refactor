import path from "path";
import { cleanupFolder } from '../fs-utils';
import { logger } from "../logger";

/**
 *
 * @param {import("refaktor-core").IPagesConfig[]} configs
 * @returns {Promise<void>}
 */
export const cleanup = async (configs) => {
    for (const configIndex in configs) {
        const config = configs[configIndex];

        const compareFolder = path.join(config.output ?? '', './compare');
        logger.info(`Removing folder ${compareFolder}`);
        await cleanupFolder(compareFolder)

        const diffFolder = path.join(config.output ?? '', './diff');
        logger.info(`Removing folder ${diffFolder}`);
        await cleanupFolder(diffFolder);
    }
}