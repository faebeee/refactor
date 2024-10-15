import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { logger } from '../logger';
import { IPagesConfig, IScreenshotType } from '../types';
import { IFileAdapter } from './IFileAdapter';

export type S3AdapterConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
  bucket: string
}

export class S3Adapter implements IFileAdapter {
  constructor(private config: S3AdapterConfig) {
    logger.debug('Create S3 file adapter');
  }

  async writeFile(config: IPagesConfig, type: IScreenshotType, fileName: string, data: Buffer) {
    const file = `${ config.id }-${ type }-${ fileName }`;
    logger.debug(`Uploading file ${ file } to S3`);

    const uploader = new Upload({
      client: new S3Client({
        credentials: {
          accessKeyId: this.config.accessKeyId,
          secretAccessKey: this.config.secretAccessKey
        },
        region: this.config.region
      }),
      params: {
        ACL: 'public-read',
        Bucket: this.config.bucket,
        Key: file,
        Body: data
      },
      tags: [], // optional tags
      queueSize: 4, // optional concurrency configuration
      partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
      leavePartsOnError: false, // optional manually handle dropped parts
    });
    await uploader.done();

  }


}