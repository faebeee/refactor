import { IPagesConfig, IScreenshotType } from '../types';

export interface IFileAdapter {
  fileExists(config: IPagesConfig, type: IScreenshotType, fileName: string):Promise<boolean>;
  readFile(config: IPagesConfig, type: IScreenshotType, fileName: string):Promise<Buffer | null>;
  deleteFile(config: IPagesConfig, type: IScreenshotType, fileName: string):Promise<void>;
  writeFile(config: IPagesConfig, type: IScreenshotType, fileName: string, data: Buffer): Promise<void>;
}