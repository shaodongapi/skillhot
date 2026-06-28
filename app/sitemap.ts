import type { MetadataRoute } from 'next';
import { skills } from '@/data/skills';
import { categories } from '@/data/categories';
import { getAllTopics, getCollections } from '@/lib/data';

const BASE = 'https://skillhot.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/ranking`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/topics`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/collections`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE}/categories/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const topicRoutes: MetadataRoute.Sitemap = getAllTopics().map((t) => ({
    url: `${BASE}/topics/${t.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = getCollections().map((c) => ({
    url: `${BASE}/collections/${c.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const skillRoutes: MetadataRoute.Sitemap = skills.map((s) => ({
    url: `${BASE}/skill/${s.id}`,
    lastModified: new Date(s.lastCommit),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...topicRoutes,
    ...collectionRoutes,
    ...skillRoutes,
  ];
}
