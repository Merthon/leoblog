import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedWriting } from '../lib/content';
import { SITE, SITE_TITLE } from '../config/site';

export async function GET(context: APIContext) {
  const entries = await getPublishedWriting();
  return rss({
    title: SITE_TITLE,
    description: SITE.description,
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
