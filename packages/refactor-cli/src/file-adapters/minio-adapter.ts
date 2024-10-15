import * as Buffer from 'buffer';
import { Client, ClientOptions } from 'minio';
import { logger } from '../logger';
import { IPagesConfig, IScreenshotType } from '../types';
import { IFileAdapter } from './IFileAdapter';

export class MinIOAdapter implements IFileAdapter {
  private client: Client;

  constructor(private config: ClientOptions, private bucket: string) {
    logger.debug('Create MinIO file adapter');
    this.client = new Client(this.config);
  }

  async fileExists(config: IPagesConfig, type: IScreenshotType, fileName: string): Promise<boolean> {
    const file = `${ config.id }/${ type }/${ fileName }`;
    try {
      await this.client.statObject(this.bucket, file);
      return true;
    } catch {
      return false;
    }
  }


  async deleteFile(config: IPagesConfig, type: IScreenshotType, fileName: string): Promise<void> {
    const file = `${ config.id }/${ type }/${ fileName }`;
    logger.debug(`Remove file ${ file } from MinIo`);
    await this.client.removeObject(this.bucket, file);
  }


  async readFile(config: IPagesConfig, type: IScreenshotType, fileName: string): Promise<Buffer> {
    const file = `${ config.id }/${ type }/${ fileName }`;
    logger.debug(`Read file ${ file } from MinIo`);

    const stream = await this.client.getObject(this.bucket, file);
    return new Promise((resolve, reject) => {
      let buffer = Buffer.from([]);
      stream.on('data', buf => {
        buffer = Buffer.concat([buffer, buf]);
      });
      stream.on('end', () => resolve(buffer));
      stream.on('error', reject);
    });
  }

  async writeFile(config: IPagesConfig, type: IScreenshotType, fileName: string, data: Buffer) {
    const file = `${ config.id }/${ type }/${ fileName }`;
    logger.debug(`Upload file ${ file } to MinIo`);
    await this.client.putObject(this.bucket, file, data);
  }
}