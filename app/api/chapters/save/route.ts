import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { commitFile } from '@/lib/github';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Hard gate: no session, or session role isn't "editor" -> reject.
  // This runs server-side on every save, so it can't be bypassed by
  // hiding/showing the Studio UI on the client.
  const role = (session?.user as any)?.role;
  if (!session || role !== 'editor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { moduleSlug, chapterSlug, meta, content } = await req.json();

  if (!moduleSlug || !chapterSlug || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const frontmatter = Object.entries(meta || {})
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? JSON.stringify(v) : v}`)
    .join('\n');
  const fileBody = `---\n${frontmatter}\n---\n\n${content}\n`;

  const repoPath = `content/cloud-native-development/${moduleSlug}/${chapterSlug}.mdx`;

  try {
    await commitFile(
      repoPath,
      fileBody,
      `content: update ${moduleSlug}/${chapterSlug}`,
      session.user?.name || 'Studio Editor',
      session.user?.email || 'studio@codeverse.xxx.com'
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  // Netlify's GitHub integration auto-deploys on this push, so the
  // change goes live a minute or two after this returns.
  return NextResponse.json({ ok: true });
}