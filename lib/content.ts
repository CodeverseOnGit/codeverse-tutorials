import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export interface TrackMeta {
  slug: string;
  title: string;
  description?: string;
  order: number;
}

export interface ChapterMeta {
  title: string;
  module: number;
  chapter: number;
  milestone?: boolean;
  articlePrompt?: string;
  slug: string;
  moduleSlug: string;
  trackSlug: string;
}

export interface ModuleMeta {
  title: string;
  order: number;
  slug: string;
  trackSlug: string;
  chapters: ChapterMeta[];
}

// Lists every track (top-level folder under content/ with a track.json).
export function getTracks(): TrackMeta[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];

  return fs
    .readdirSync(CONTENT_ROOT)
    .filter((d) => fs.statSync(path.join(CONTENT_ROOT, d)).isDirectory())
    .map((slug) => {
      const trackJsonPath = path.join(CONTENT_ROOT, slug, 'track.json');
      if (!fs.existsSync(trackJsonPath)) return null;
      const meta = JSON.parse(fs.readFileSync(trackJsonPath, 'utf-8'));
      return { slug, ...meta } as TrackMeta;
    })
    .filter((t): t is TrackMeta => t !== null)
    .sort((a, b) => a.order - b.order);
}

export function getTrack(trackSlug: string): TrackMeta | null {
  const trackJsonPath = path.join(CONTENT_ROOT, trackSlug, 'track.json');
  if (!fs.existsSync(trackJsonPath)) return null;
  const meta = JSON.parse(fs.readFileSync(trackJsonPath, 'utf-8'));
  return { slug: trackSlug, ...meta };
}

// Builds the module/chapter nav tree for a single track.
export function getNavTree(trackSlug: string): ModuleMeta[] {
  const trackRoot = path.join(CONTENT_ROOT, trackSlug);
  if (!fs.existsSync(trackRoot)) return [];

  const moduleDirs = fs
    .readdirSync(trackRoot)
    .filter((d) => fs.statSync(path.join(trackRoot, d)).isDirectory())
    .sort();

  return moduleDirs
    .map((moduleSlug) => {
      const moduleDir = path.join(trackRoot, moduleSlug);
      const metaPath = path.join(moduleDir, 'meta.json');
      if (!fs.existsSync(metaPath)) return null;
      const moduleMeta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

      const chapters: ChapterMeta[] = fs
        .readdirSync(moduleDir)
        .filter((f) => f.endsWith('.mdx'))
        .map((file) => {
          const raw = fs.readFileSync(path.join(moduleDir, file), 'utf-8');
          const { data } = matter(raw);
          return {
            ...data,
            slug: file.replace('.mdx', ''),
            moduleSlug,
            trackSlug,
          } as ChapterMeta;
        })
        .sort((a, b) => a.chapter - b.chapter);

      return {
        title: moduleMeta.title,
        order: moduleMeta.order,
        slug: moduleSlug,
        trackSlug,
        chapters,
      };
    })
    .filter((m): m is ModuleMeta => m !== null)
    .sort((a, b) => a.order - b.order);
}

export function getChapter(trackSlug: string, moduleSlug: string, chapterSlug: string) {
  const filePath = path.join(CONTENT_ROOT, trackSlug, moduleSlug, `${chapterSlug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { meta: data as ChapterMeta, content };
}