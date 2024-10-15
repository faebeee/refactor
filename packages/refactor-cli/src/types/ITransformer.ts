import { ICompareResultEntry } from './ICompareResult';


export interface ITransformer {
  transform(entry: ICompareResultEntry): Promise<ICompareResultEntry>;
}