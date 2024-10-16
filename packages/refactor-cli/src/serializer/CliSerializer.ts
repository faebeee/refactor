import chalk from 'chalk';

import SimpleTable from 'cli-simple-table';
import { logger } from '../logger';
import { ICompareResult } from '../types';
import { ISerializer } from './ISerializer.js';

export class CliSerializer implements ISerializer {

  async serialize(result: ICompareResult) {
    logger.debug('CliSerializer started');
    const table = new SimpleTable();
    table.header('Config', 'Page', 'Status');

    result.results.forEach(entry => {
      table.row(result.id, entry.id, entry.pass ? chalk.green('PASS') : chalk.red('FAILED'));
    });

    console.log(table.toString());
  }
}