import path from "path";
import {IPagesConfig, IPagesEntry} from "./types";
import {IScreenshotType} from "./types/IScreenshotType";
import {IScreenshotOutputConfig} from "./types/IScreenshotOutputConfig";

/**
 *
 */
export const getConfigOutputFolder = (config: IPagesConfig): string => path.resolve(config.output ?? process.cwd());

/**
 * Retrieves the file name for a screenshot based on the provided configuration and entry.
 */
export const getScreenshotOutputConfig = (config: IPagesConfig, entry: IPagesEntry, type: IScreenshotType = IScreenshotType.ORIGINAL): IScreenshotOutputConfig => {
  const outputDirectory = getConfigOutputFolder(config);
  const folder = path.join(outputDirectory, type, config.id);
  const fileName = `${entry.id}.png`;
  return {
    folder,
    fileName,
    file: path.join(folder, fileName),
  };
}