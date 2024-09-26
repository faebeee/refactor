import {ISerializer} from "./ISerializer";
import {ICompareResult} from "../types";
import fs from 'fs';
import {getRootDir} from "../fs-utils";
import path from "path";

export class HtmlSerializer implements ISerializer {
  file: string;

  constructor(file: string) {
    this.file = file
  }

  async serialize(results: ICompareResult[]) {
    console.log((await fs.promises.readFile(path.resolve(getRootDir(), 'src/template/report.html'))).toString());
  }
}