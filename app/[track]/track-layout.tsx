import { getNavTree, getTrack } from '@/lib/content';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function TrackLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { track: string };
}) {
  const track = getTrack(params.track);
  if (!track) return notFound();

  const modules = getNavTree(params.track);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: 280, borderRight: '1px solid #eee', padding: '1rem' }}>
        <Link href="/"><span style={{ fontSize: 13, color: '#888' }}>← all tutorials</span></Link>
        <h3 style={{ marginTop: 8 }}>{track.title}</h3>
        {modules.map((m) => (
          <div key={m.slug} style={{ marginBottom: '1rem' }}>
            <strong>{m.title}</strong>
            <ul style={{ listStyle: 'none', paddingLeft: 8 }}>
              {m.chapters.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${params.track}/${m.slug}/${c.slug}`}>
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <main style={{ flex: 1, padding: '2rem', maxWidth: 800 }}>{children}</main>
    </div>
  );
}