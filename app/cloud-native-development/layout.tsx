import { getNavTree } from '@/lib/content';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const modules = getNavTree();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: 280, borderRight: '1px solid #eee', padding: '1rem' }}>
        <Link href="/cloud-native-development"><h3>Cloud Native Dev Path</h3></Link>
        {modules.map((m) => (
          <div key={m.slug} style={{ marginBottom: '1rem' }}>
            <strong>{m.title}</strong>
            <ul style={{ listStyle: 'none', paddingLeft: 8 }}>
              {m.chapters.map((c) => (
                <li key={c.slug}>
                  <Link href={`/cloud-native-development/${m.slug}/${c.slug}`}>
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
