import { getNavTree, getTrack, getTracks } from '@/lib/content';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getTracks().map((t) => ({ track: t.slug }));
}

export default function TrackIndexPage({ params }: { params: { track: string } }) {
  const track = getTrack(params.track);
  if (!track) return notFound();

  const modules = getNavTree(params.track);

  return (
    <div>
      <h1>{track.title}</h1>
      {track.description && <p>{track.description}</p>}
      {modules.map((m) => (
        <div key={m.slug} style={{ marginBottom: '1.5rem' }}>
          <h2>{m.title}</h2>
          <ul>
            {m.chapters.map((c) => (
              <li key={c.slug}>{c.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}