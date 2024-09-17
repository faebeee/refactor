import {IPagesEntry} from "./IPagesEntry";
import {Page} from "puppeteer";

export type IPagesConfig = {
  id: string;
  url: string;
  fullpage?: boolean;
  viewport?: [number, number];
  output?: string;
  pages: IPagesEntry[];
  setup: (page: Page) => Promise<void>
}