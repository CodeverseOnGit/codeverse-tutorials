import { getNavTree } from '@/lib/content';

export default function IndexPage() {
  const modules = getNavTree();
  return (
    <div>
      <h1>Cloud Native Developer: Zero to Hero</h1>
      <p>A project-based learning path from Linux fundamentals to a production-grade capstone.</p>
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
