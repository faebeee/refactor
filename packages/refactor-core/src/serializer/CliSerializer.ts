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

    console.log(results);

    results.forEach((result) => {
      result.results.forEach(entry => {
        console.log(entry.id, entry.pass)
        table.row(result.id, entry.id, entry.pass ? figures.tick : figures.cross)
      })
    })

    console.log(table.toString());
  }
}