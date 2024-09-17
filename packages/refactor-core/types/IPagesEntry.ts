import {Page} from "puppeteer";

export type IPagesEntry = {
  id: string;
  path: string;
  setup: (page: Page) => Promise<void>
}