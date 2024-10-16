import puppeteer from 'puppeteer';
import { logger } from '../logger';

export const getBrowser = async (width?: number, height?: number) => {
  logger.debug('Starting browser');
  return puppeteer.launch({
    headless: true,
    devtools: false,
    dumpio: false,
    timeout: 60_000,
    defaultViewport: { width: width ?? 1600, height: height ?? 1200 },
  });
};