import {ICompareResultEntry} from "./ICompareResult";

export type ITransformer = (entry: ICompareResultEntry) => Promise<ICompareResultEntry>;