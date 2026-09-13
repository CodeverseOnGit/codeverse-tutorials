import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), 'content', 'cloud-native-development');

export interface ChapterMeta {
  title: string;
  module: number;
  chapter: number;
  milestone?: boolean;
  articlePrompt?: string;
  slug: string;
  moduleSlug: string;
}

export interface ModuleMeta {
  title: string;
  order: number;
  slug: string;
  chapters: ChapterMeta[];
}

// Reads every module folder + meta.json, and every .mdx file's frontmatter,
// to build the full nav tree. Runs at build time (or request time in dev).
export function getNavTree(): ModuleMeta[] {
  const moduleDirs = fs
    .readdirSync(CONTENT_ROOT)
    .filter((d) => fs.statSync(path.join(CONTENT_ROOT, d)).isDirectory())
    .sort();

  return moduleDirs.map((moduleSlug) => {
    const moduleDir = path.join(CONTENT_ROOT, moduleSlug);
    const metaPath = path.join(moduleDir, 'meta.json');
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
        } as ChapterMeta;
      })
      .sort((a, b) => a.chapter - b.chapter);

    return {
      title: moduleMeta.title,
      order: moduleMeta.order,
      slug: moduleSlug,
      chapters,
    };
  }).sort((a, b) => a.order - b.order);
}

export function getChapter(moduleSlug: string, chapterSlug: string) {
  const filePath = path.join(CONTENT_ROOT, moduleSlug, `${chapterSlug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { meta: data as ChapterMeta, content };
}

// Used by the editor's save endpoint. Writes frontmatter + body back to disk.
export function writeChapter(
  moduleSlug: string,
  chapterSlug: string,
  meta: Record<string, unknown>,
  content: string
) {
  const dir = path.join(CONTENT_ROOT, moduleSlug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${chapterSlug}.mdx`);

  const frontmatter = Object.entries(meta)
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`)
    .join('\n');

  const fileBody = `---\n${frontmatter}\n---\n\n${content}\n`;
  fs.writeFileSync(filePath, fileBody, 'utf-8');
}
