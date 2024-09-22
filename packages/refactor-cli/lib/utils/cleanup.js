import path from "path";
import { cleanupFolder, logger } from "refaktor-core";

/**
 *
 * @param {IPagesConfig[]} configs
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