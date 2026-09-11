import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedWritingEn } from '../../lib/content';
import { SITE, SITE_EN } from '../../config/site';

export async function GET(context: APIContext) {
  const entries = await getPublishedWritingEn();
  return rss({
    title: `${SITE.displayName} / Personal Log`,
    description: SITE_EN.description,
    site: context.site ?? 'https://example.com',
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAt,
      link: `/en/writing/${entry.id}/`,
      categories: entry.data.tags,
    })),
  });
}
