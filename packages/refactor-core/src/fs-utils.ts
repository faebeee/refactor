import fs from "fs";
import {logger} from "./logger.js";
import path from "path";

export const cleanupFolder = async (dir: string) => {
  if (await doesFileExist(dir)) {
    logger.debug(`Remove folder ${dir}`);
    await fs.promises.rm(dir, {recursive: true});
  }
}

export const ensureFolder = async (folder: string) => {
  logger.debug(`Check if folder ${folder} exists`);
  await fs.promises.mkdir(folder, {recursive: true});
}

export const doesFileExist = async (file: string) => {
  try {
    const fileAlreadyExists = await fs.promises.stat(file);
    return !!fileAlreadyExists;
  } catch {

  }
  return false
}


export const getRootDir = () => path.resolve(__dirname, '..')