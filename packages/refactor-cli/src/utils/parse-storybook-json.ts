import path from 'path';
import { logger } from '../logger';
import { IPagesConfig } from '../types';

type StorybookEntry = {
  type: 'story' | 'docs';
  id: string;
  name: string;
  title: string;
  componentPath: string
}

export const parseStorybookJson = (config:IPagesConfig, storybookFolder: string): IPagesConfig => {
  const indexJson = require(path.join(storybookFolder, `/index.json`));
  const entries: StorybookEntry[] = Object.values(indexJson.entries);
  const stories = entries.filter((e) => e.type === 'story');
  logger.debug(`Found ${ stories.length } stories`);

  return {
    ...config,
    pages: stories.map(story => ({
      id: story.id,
      path: `/iframe.html?args=&id=${ story.id }&viewMode=story`
    }))
  };
};