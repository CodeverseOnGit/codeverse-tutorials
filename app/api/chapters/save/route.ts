import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeChapter } from '@/lib/content';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Hard gate: no session, or session role isn't "editor" -> reject.
  // This check happens server-side on every save, so a reader can't
  // bypass it by hitting the API directly or editing client JS.
  const role = (session?.user as any)?.role;
  if (!session || role !== 'editor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { moduleSlug, chapterSlug, meta, content } = await req.json();

  if (!moduleSlug || !chapterSlug || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  writeChapter(moduleSlug, chapterSlug, meta, content);

  // Optional: also commit to git here via a GitHub API call so every
  // save is versioned and attributable to session.user.email.
  return NextResponse.json({ ok: true });
}
