import {logger} from "../logger";

import SimpleTable from "cli-simple-table";
import {ISerializer} from "./ISerializer.js";
import {ICompareResult} from "../types";
import chalk from "chalk";

export class CliSerializer implements ISerializer {

  async serialize(results: ICompareResult[]) {
    logger.debug('CliSerializer started')
    const table = new SimpleTable();
    table.header('Config', 'Page', 'Status');

    results.forEach((result) => {
      result.results.forEach(entry => {
        table.row(result.id, entry.id, entry.pass ? chalk.green('PASS') : chalk.red('FAILED'))
      })
    })

    console.log(table.toString());
  }
}