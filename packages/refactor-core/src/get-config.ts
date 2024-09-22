import path from "path";
import {logger} from "./logger.js";
import {IPagesConfig} from "./types";

/**
 * Asynchronously retrieves a configuration object from a specified file path.
 */
export const getConfig = async (pathToFile: string): Promise<IPagesConfig[]> => {
  const file = path.resolve(process.cwd(), pathToFile);
  logger.debug(`Loading configuration from ${file}`)
  const config = await import(file);
  logger.debug(`Config ${config.default.id} loaded`)
  return config.default;
}