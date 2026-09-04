import { getCollection, type CollectionEntry } from 'astro:content';

export type WritingEntry = CollectionEntry<'writing'>;
export type ReadingEntry = CollectionEntry<'reading'>;
export type ProjectEntry = CollectionEntry<'projects'>;

export const writingTypeLabels = {
  technical: '技术',
  thinking: '思考',
  essay: '随笔',
} as const;

export const projectStatusLabels = {
  building: '进行中',
  maintaining: '维护中',
  completed: '已完成',
  archived: '归档',
} as const;

export async function getPublishedWriting() {
  const entries = await getCollection('writing', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getReadingNotes() {
  const entries = await getCollection('reading', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

export async function getProjects() {
  const entries = await getCollection('projects');
  return entries.sort((a, b) => b.data.updatedAt.valueOf() - a.data.updatedAt.valueOf());
}

export function formatDate(date: Date, full = true) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: full ? 'numeric' : undefined,
    month: '2-digit',
    day: '2-digit',
  }).format(date).replaceAll('/', '.');
}

export function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  }).format(date).replaceAll('/', '.');
}

export function isCurrentProject(status: ProjectEntry['data']['status']) {
  return status === 'building' || status === 'maintaining';
}
