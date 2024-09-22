import {logger} from "../logger";
import figures from "figures";
import SimpleTable from "cli-simple-table";
import {ISerializer} from "./ISerializer.js";
import {ICompareResult} from "../types/ICompareResult";

export class CliSerializer implements ISerializer {

  async serialize(results: ICompareResult[]) {
    logger.debug('CliSerializer started')
    const table = new SimpleTable();
    table.header('Config', 'Page', 'Status');


    results.forEach((result) => {
      result.results.forEach(entry => {
        table.row(result.id, entry.id, entry.pass ? figures.tick : figures.cross)
      })
    })

    if (logger.level === 'info') {
      console.log(table.toString());
    }
  }
}