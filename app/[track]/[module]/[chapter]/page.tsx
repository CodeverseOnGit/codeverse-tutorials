import { getChapter, getTracks, getNavTree } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import TerminalChallenge from '@/components/TerminalChallenge';

// Pre-renders every chapter across every track at build time, avoiding
// runtime filesystem reads inside Netlify's serverless functions.
export function generateStaticParams() {
  const tracks = getTracks();
  return tracks.flatMap((t) => {
    const modules = getNavTree(t.slug);
    return modules.flatMap((m) =>
      m.chapters.map((c) => ({ track: t.slug, module: m.slug, chapter: c.slug }))
    );
  });
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ track: string; module: string; chapter: string }>;
}) {
  const { track, module: moduleSlug, chapter } = await params;
  const data = getChapter(track, moduleSlug, chapter);
  if (!data) return notFound();

  const { meta, content } = data;

  return (
    <article>
      <h1>{meta.title}</h1>
      {meta.milestone && <p><strong>🏁 Milestone chapter</strong></p>}
      <MDXRemote
        source={content}
        components={{ TerminalChallenge }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm as any],
            rehypePlugins: [rehypeHighlight as any],
          },
        }}
      />
      {meta.articlePrompt && (
        <aside style={{ marginTop: '2rem', padding: '1rem', background: '#f6f6f6' }}>
          <strong>Write about it:</strong> {meta.articlePrompt}
        </aside>
      )}
    </article>
  );
}