import path from 'path';
import { logger } from '../../src/logger';
import { IPagesConfig } from '../../src/types';

type StorybookEntry = {
  type: 'story' | 'docs';
  id: string;
  name: string;
  title: string;
  componentPath: string
}

export const parseStorybookJson = (storybookFolder: string): IPagesConfig => {
  const indexJson = require(path.resolve(process.cwd(), path.join(storybookFolder, `/index.json`)));
  const entries: StorybookEntry[] = Object.values(indexJson.entries);
  const stories = entries.filter((e) => e.type === 'story').slice(0, 10);
  logger.debug(`Found ${ stories.length } stories`);

  return {
    id: 'storybook',
    url: 'http://localhost:8080',
    output:'./refaktor-storybook',
    fullpage: true,
    pages: stories.map(story => ({
      id: story.id,
      path: `/iframe.html?args=&id=${ story.id }&viewMode=story`
    }))
  };
};