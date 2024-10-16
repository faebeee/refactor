import path from 'path';
import { logger } from './logger.js';
import { IPagesConfig } from './types';


/**
 * Asynchronously retrieves a configuration object from a specified file path.
 */
export const getConfig = async (pathToFile: string): Promise<IPagesConfig> => {
  const file = path.resolve(process.cwd(), pathToFile);
  logger.debug(`Loading configuration from ${ file }`);
  const configModule = await import(file);
  const config: IPagesConfig = configModule.default;

  logger.debug(`Config ${ config.id } loaded with ${config.pages?.length} pages`);
  return config;
};