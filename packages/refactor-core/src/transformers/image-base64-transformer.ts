import fs from 'fs';
import {ICompareResultEntry} from "../types/ICompareResult";
import {ITransformer} from "../types/ITransformer";

export const transformImageToBase64: ITransformer = async (entry: ICompareResultEntry): Promise<ICompareResultEntry> => {
  const original = await fs.promises.readFile(entry.original, {encoding: 'base64'});
  const diff = entry.pass ? '' : await fs.promises.readFile(entry.diff, {encoding: 'base64'});
  const current = await fs.promises.readFile(entry.current, {encoding: 'base64'});

  return {
    ...entry,
    original,
    diff,
    current
  }
}