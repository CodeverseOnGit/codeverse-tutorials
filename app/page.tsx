import { getTracks, getNavTree } from '@/lib/content';
import Link from 'next/link';

export default function LandingPage() {
  const tracks = getTracks();

  return (
    <div className="page">
      {/* ---------- NAV ---------- */}
      <header className="nav">
        <Link href="/" className="brand">
          <img src="/logo.svg" alt="" width={28} height={28} />
          <span>codeverse</span>
        </Link>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="heroText">
          <p className="kicker">tutorials</p>
          <h1>
            Learn by building
            <br />
            real things.
          </h1>
          <p className="sub">
            Project-based paths that take you from fundamentals to a
            real, shippable result — not just theory. Pick a track below.
          </p>
        </div>
      </section>

      {/* ---------- TRACK LIST ---------- */}
      <section className="tracks">
        <p className="sectionLabel">available tracks</p>
        <div className="trackGrid">
          {tracks.map((t) => {
            const modules = getNavTree(t.slug);
            const chapterCount = modules.reduce((sum, m) => sum + m.chapters.length, 0);
            return (
              <Link key={t.slug} href={`/${t.slug}`} className="trackCard">
                <h2>{t.title}</h2>
                {t.description && <p>{t.description}</p>}
                <span className="trackMeta">
                  {modules.length} modules · {chapterCount} chapters
                </span>
              </Link>
            );
          })}
          {tracks.length === 0 && (
            <p className="sub">No tracks published yet — add one under content/.</p>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="brand">
          <img src="/logo.svg" alt="" width={20} height={20} />
          <span>codeverse</span>
        </div>
      </footer>

    </div>
  );
}