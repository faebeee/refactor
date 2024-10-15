import fs from 'fs';
import { IFileAdapter } from '../file-adapters';
import { logger } from '../logger';
import { ICompareResultEntry, ITransformer } from '../types';

export class ImageBase64Transformer implements ITransformer {
  constructor(private fileAdapter: IFileAdapter) {
  }

  async transform(entry: ICompareResultEntry): Promise<ICompareResultEntry> {
    // this.fileAdapter.readFile(this.config)
    const original = await fs.promises.readFile(entry.original, { encoding: 'base64' });
    const diff = entry.pass ? '' : await fs.promises.readFile(entry.diff, { encoding: 'base64' });
    const current = await fs.promises.readFile(entry.current, { encoding: 'base64' });

    return {
      ...entry,
      original,
      diff,
      current
    };
  }
}