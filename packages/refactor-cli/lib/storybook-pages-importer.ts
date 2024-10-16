export type StorybookEntry = {
  type: 'story' | 'docs';
  id: string;
  name: string;
  title: string;
  componentPath: string
}

export const storybookPagesImporter = (indexJson: { entries: any }) => {
  const entries: StorybookEntry[] = Object.values(indexJson.entries);
  const stories = entries.filter((e) => e.type === 'story');

  return stories.map(story => ({
    id: story.id,
    path: `/iframe.html?args=&id=${ story.id }&viewMode=story`
  }));
};