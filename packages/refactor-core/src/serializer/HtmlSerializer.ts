import {ISerializer} from "./ISerializer";
import {ICompareResult} from "../types";
import fs from 'fs';

export class HtmlSerializer implements ISerializer {
  file: string;

  constructor(file: string) {
    this.file = file
  }

  async serialize(results: ICompareResult[]) {
    console.log(await fs.promises.readFile('../template/report.html'));
    // console.log(import.meta.url);
  }
}