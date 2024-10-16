import { Page } from 'puppeteer';
import { IPagesEntry } from './IPagesEntry';

export type IPagesConfig = {
  id: string;
  url: string;
  fullpage?: boolean;
  viewport?: [number, number];
  output?: string | {
    type: 'minio',
    config: {
      endPoint: string,
      port?: number,
      useSSL?: boolean,
      accessKey: string,
      secretKey: string,
      bucket: string
    }
  };
  pages?: (IPagesEntry[]);
  setup?: (page: Page) => Promise<void>
}
