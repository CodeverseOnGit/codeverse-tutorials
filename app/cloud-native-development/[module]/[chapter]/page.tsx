import { getChapter } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';

export default function ChapterPage({
  params,
}: {
  params: { module: string; chapter: string };
}) {
  const data = getChapter(params.module, params.chapter);
  if (!data) return notFound();

  const { meta, content } = data;

  return (
    <article>
      <h1>{meta.title}</h1>
      {meta.milestone && <p><strong>🏁 Milestone chapter</strong></p>}
      <MDXRemote
        source={content}
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
