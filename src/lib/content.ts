import { getCollection, type CollectionEntry } from 'astro:content';

const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) =>
  b.data.date.getTime() - a.data.date.getTime();

const published = <T extends { data: { draft: boolean } }>(e: T) =>
  !e.data.draft || import.meta.env.DEV;

export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  return (await getCollection('projects', published)).sort(byDateDesc);
}

export async function getAlbums(): Promise<CollectionEntry<'photography'>[]> {
  return (await getCollection('photography', published)).sort(byDateDesc);
}

export async function getVideos(): Promise<CollectionEntry<'videography'>[]> {
  return (await getCollection('videography', published)).sort(byDateDesc);
}
