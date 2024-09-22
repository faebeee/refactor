import fs from "fs";
import {logger} from "../logger";
import {ISerializer} from "./ISerializer";
import {ICompareResult} from "../types";

export class FileSerializer implements ISerializer {

  file: string;

  constructor(file: string) {
    this.file = file
  }

  async serialize(results: ICompareResult[]) {
    logger.info(`Write results to ${this.file}`);
    await fs.promises.writeFile(this.file, JSON.stringify(results, null, 2));
  }
}