import fs from 'fs';
import path from 'path';
import { ensureFolder } from '../fs-utils';
import { logger } from '../logger';
import { IPagesConfig, IScreenshotType } from '../types';
import { IFileAdapter } from './IFileAdapter';


export class LocalAdapter implements IFileAdapter {
  constructor(private rootFolder:string) {
    logger.debug('Create local file adapter');
  }

  async deleteFile(config: IPagesConfig, type: IScreenshotType, fileName: string): Promise<void> {
    const folder = path.resolve(this.rootFolder, path.join(config.id, type ));
    await ensureFolder(folder);
    const file = path.join(folder, fileName);

    fs.rmSync(file, { recursive: true, force: true });
  }

  async fileExists(config: IPagesConfig, type: IScreenshotType, fileName: string): Promise<boolean> {
    const folder = path.resolve(this.rootFolder, path.join(config.id, type ));
    await ensureFolder(folder);
    const file = path.join(folder, fileName);

    return fs.existsSync(file);
  }

  async readFile(config: IPagesConfig, type: IScreenshotType, fileName: string): Promise<Buffer | null> {
    const folder = path.resolve(this.rootFolder, path.join(config.id, type ));
    await ensureFolder(folder);
    const file = path.join(folder, fileName);

    return fs.readFileSync(file);
  }

  async writeFile(config: IPagesConfig, type: IScreenshotType, fileName: string, data: Buffer): Promise<void> {
    const folder = path.resolve(this.rootFolder, path.join(config.id, type ));
    await ensureFolder(folder);
    const diffFile = path.join(folder, fileName);

    logger.debug(`Writing file ${diffFile}`);
    fs.writeFileSync(diffFile, data);
  }
}