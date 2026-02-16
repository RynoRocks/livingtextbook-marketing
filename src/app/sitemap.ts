import type { MetadataRoute } from 'next';
import { locales } from '@/i18n';
import { blogPosts, getLocalizedSlug } from '@/lib/blog';

const baseUrl = 'https://thelivingtextbook.lokalingo.com';

const staticPages = [
  '',
  '/features',
  '/for-educators',
  '/for-learners',
  '/blog',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : page === '/blog' ? 'daily' : 'monthly',
        priority: page === '' ? 1.0 : page === '/blog' ? 0.9 : 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${baseUrl}/${l}${page}`])
            ),
            'x-default': `${baseUrl}/en${page}`,
          },
        },
      });
    }
  }

  // Blog post pages
  for (const post of blogPosts) {
    for (const locale of locales) {
      const slug = getLocalizedSlug(post, locale);
      entries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${baseUrl}/${l}/blog/${getLocalizedSlug(post, l)}`])
            ),
            'x-default': `${baseUrl}/en/blog/${post.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
