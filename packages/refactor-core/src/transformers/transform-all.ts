import {logger} from "../logger";
import {ResultCollector} from "../ResultCollector";
import {ICompareResult} from "../types/ICompareResult";


export const transformAll = async (results: ResultCollector[]): Promise<ICompareResult[]> => {
  logger.debug('Transforming results');
  const transformed:ICompareResult[] = []
  for (const rIndex in results) {
    const result = results[rIndex];
    transformed.push(await result.transform());
  }
  return transformed;
}