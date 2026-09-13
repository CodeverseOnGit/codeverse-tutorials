'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';

// This page is intentionally OUTSIDE the public /cloud-native-development
// route tree, and every save it triggers is re-checked server-side in
// /api/chapters/save. Hiding the UI is a convenience, not the security
// boundary — the API route is the actual boundary.
export default function StudioPage() {
  const { data: session, status } = useSession();
  const [moduleSlug, setModuleSlug] = useState('01-foundations');
  const [chapterSlug, setChapterSlug] = useState('01-linux-shell-networking');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status2, setStatus2] = useState('');

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Sign in to access the content studio.</p>
        <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      </div>
    );
  }

  const role = (session.user as any)?.role;
  if (role !== 'editor') {
    return <p>Your account ({session.user?.email}) doesn't have editor access.</p>;
  }

  async function handleSave() {
    setStatus2('Saving...');
    const res = await fetch('/cloud-native-development/api/chapters/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moduleSlug,
        chapterSlug,
        meta: { title, module: 1, chapter: 1 },
        content: body,
      }),
    });
    setStatus2(res.ok ? 'Saved.' : 'Failed: ' + (await res.text()));
  }

  // Minimal textarea-based editor with a "insert code block" and
  // heading-size shortcuts. Swap this out for Tiptap/Editor.js when
  // you want a true WYSIWYG experience — the save flow stays the same.
  return (
    <div style={{ padding: '2rem', maxWidth: 700 }}>
      <h2>Content Studio</h2>
      <input value={moduleSlug} onChange={(e) => setModuleSlug(e.target.value)} placeholder="module slug" />
      <input value={chapterSlug} onChange={(e) => setChapterSlug(e.target.value)} placeholder="chapter slug" />
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Chapter title" style={{ display: 'block', width: '100%', margin: '8px 0' }} />

      <div style={{ marginBottom: 8 }}>
        <button onClick={() => setBody(body + '\n## Heading\n')}>H2</button>
        <button onClick={() => setBody(body + '\n### Subheading\n')}>H3</button>
        <button onClick={() => setBody(body + '\n```bash\n\n```\n')}>Code block</button>
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={20}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />

      <button onClick={handleSave}>Save chapter</button>
      <p>{status2}</p>
    </div>
  );
}
