import fs from 'fs';
import path from 'path';
import { ensureFolder } from '../fs-utils';
import { getConfigOutputFolder } from '../get-screenshot-file-name';
import { logger } from '../logger';
import { IPagesConfig } from '../types';
import { IFileAdapter } from './IFileAdapter';


export class LocalAdapter implements IFileAdapter {
  constructor() {
    logger.debug('Create local file adapter');
  }

  async writeFile(config: IPagesConfig, type: 'original' | 'diff' | 'current', fileName: string, data: Buffer): Promise<void> {
    logger.debug(`Write ${ fileName } to local filesystem`);

    const diffFolder = path.join(getConfigOutputFolder(config), type, config.id);
    await ensureFolder(diffFolder);
    const diffFile = path.join(diffFolder, fileName);

    fs.writeFileSync(diffFile, data);

  }

}