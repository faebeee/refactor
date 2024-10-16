import { Command } from 'commander';
import { logger } from '../logger';

export const commandSetup = (program:Command) => {
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