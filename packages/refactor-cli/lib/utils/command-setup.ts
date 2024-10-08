import { logger } from "refaktor-core";
import { Command } from 'commander';

/**
 *
 * @param {Command} program
 */
export const commandSetup = (program) => {
    const quiet = program.opts().silent;
    if (quiet) {
        logger.level = 'silent';
    }

    const verbose = program.opts().verbose;
    if (verbose) {
        logger.level = 'debug'
    }
    logger.info(`Set logger level to ${logger.level}`);
}