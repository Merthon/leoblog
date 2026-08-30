import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedWriting } from '../lib/content';

export async function GET(context: APIContext) {
  const entries = await getPublishedWriting();
  return rss({
    title: 'Leo / Personal Log',
    description: '一个程序员的阅读与构建记录。',
    site: context.site ?? 'https://example.com',
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAt,
      link: `/writing/${entry.id}/`,
      categories: entry.data.tags,
    })),
  });
}
