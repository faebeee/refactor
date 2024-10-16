import { IFileAdapter } from '../file-adapters';
import { ICompareResultEntry, IPagesConfig, IScreenshotType, ITransformer } from '../types';

export class ImageBase64Transformer implements ITransformer {
  constructor(private fileAdapter: IFileAdapter, private config: IPagesConfig) {
  }

  async transform(entry: ICompareResultEntry): Promise<ICompareResultEntry> {
    const originalFileBuffer = await this.fileAdapter.readFile(this.config, IScreenshotType.ORIGINAL, `${ entry.id }.png`);
    const diffFileBuffer = await this.fileAdapter.readFile(this.config, IScreenshotType.DIFF, `${ entry.id }.png`);
    const currentFileBuffer = await this.fileAdapter.readFile(this.config, IScreenshotType.COMPARE, `${ entry.id }.png`);

    const original = originalFileBuffer?.toString('base64') ?? null;
    const diff = diffFileBuffer?.toString('base64') ?? null;
    const current = currentFileBuffer?.toString('base64') ?? null;

    return {
      ...entry,
      original,
      diff,
      current
    };
  }
}