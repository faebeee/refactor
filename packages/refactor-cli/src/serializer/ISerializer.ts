import {ICompareResult} from '../types';

export interface ISerializer {
  serialize(results: ICompareResult): Promise<void>;
}