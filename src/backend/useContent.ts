import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { clubApi, type ContentSection } from './api';

export function useContent<T extends object>(section: ContentSection, fallback: T[] = []): T[] {
  const records = useQuery(clubApi.content.listPublished, { section });
  return useMemo(() => records === undefined ? fallback : records.map((row: any) => ({ ...row.data, id: row.slug, title: row.title,
    ...(row.data.storageId && row.data.url && !row.data.fileMime?.startsWith('video/') ? {
      image: row.data.url, imgSrc: row.data.url, imgUrl: row.data.url,
    } : {}),
  })), [records, fallback]);
}
