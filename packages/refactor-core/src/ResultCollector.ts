import {logger} from "./logger";
import {ICompareResult, ICompareResultEntry, IPagesConfig, IPagesEntry, ITransformer} from "./types";

export class ResultCollector {
  result: ICompareResult;
  config: IPagesConfig;
  transformers: ITransformer[] = [];

  constructor(config: IPagesConfig) {
    this.config = config;
    this.result = {
      results: [],
      id: config.id,
      created_at: new Date().toString(),
    }
    logger.debug('Collector created');
  }

  addResult(config: IPagesEntry, url: string, passed: boolean, originalFile: string, currentFile: string, diffFile: string) {
    this.result.results.push({
      id: config.id,
      config,
      current: currentFile,
      diff: diffFile,
      original: originalFile,
      pass: passed,
      url
    })
  }

  addTransformer(transformer: ITransformer) {
    this.transformers.push(transformer);
  }

  /**
   * Transforms the results using a series of transformers.
   */
  async transform(): Promise<ICompareResult> {
    const results:ICompareResultEntry[] = [];

    for (const rIndex in this.result.results) {
      results.push(await this.runTransformer(this.result.results[rIndex]))
    }

    return {
      ...this.result,
      results
    };
  }

  async runTransformer(entry: ICompareResultEntry): Promise<ICompareResultEntry> {
    let transformedEntry = entry;
    for (const tIndex in this.transformers) {
      const transformer = this.transformers[tIndex];
      transformedEntry = await transformer(transformedEntry);
    }
    return transformedEntry;
  }
}