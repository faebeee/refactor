import { LocalAdapter, MinIOAdapter } from '../file-adapters';
import { IPagesConfig } from '../types';

export const getAdapter = (config: IPagesConfig) => {
  if (typeof config.output === 'object' && config.output?.type === 'minio') {
    return new MinIOAdapter(config.output.config, config.output.config.bucket);
  }
  if (typeof config.output === 'string' ) {
    return new LocalAdapter(config.output);
  }

  throw new Error('No Adapter could be determined')
};