import { IPagesEntry } from './IPagesEntry';

export type ICompareResult = {
  created_at: string;
  id: string,
  // config: Omit<IPagesConfig, 'setup'> & { pages: Omit<IPagesEntry, 'setup'>[] }
  results: ICompareResultEntry[]
  passed: boolean
}

export type ICompareResultEntry = {
  id: string;
  url: string;
  pass: boolean
  config: Omit<IPagesEntry, 'setup'>;
  original: string | null;
  current: string | null;
  diff: string | null
}