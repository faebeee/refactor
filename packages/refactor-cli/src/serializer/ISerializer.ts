import {ICompareResult} from "../types/ICompareResult";

export interface ISerializer {
  serialize(results: ICompareResult[]): Promise<void>;
}