import os from 'os';
import path from 'path';
import { IPagesConfig, IPagesEntry, IScreenshotOutputConfig, IScreenshotType } from './types';

export const getConfigOutputFolder = (config: IPagesConfig): string => path.resolve(os.tmpdir());

export const getScreenshotOutputConfig = (config: IPagesConfig, entry: IPagesEntry, type: IScreenshotType = IScreenshotType.ORIGINAL): IScreenshotOutputConfig => {
  const outputDirectory = getConfigOutputFolder(config);
  const folder = path.join(outputDirectory, type, config.id);
  const fileName = `${ entry.id }.png`;
  return {
    folder,
    fileName,
    file: path.join(folder, fileName),
  };
};