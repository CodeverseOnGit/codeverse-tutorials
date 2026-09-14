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

      <style>{`
        .page {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 24px 96px;
        }
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 0;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 15px;
          color: var(--paper-100);
        }
        .hero {
          padding: 56px 0 72px;
        }
        .kicker {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--cyan-400);
          margin: 0 0 20px;
        }
        h1 {
          font-size: 46px;
          line-height: 1.1;
          font-weight: 600;
          margin: 0 0 22px;
          letter-spacing: -0.01em;
        }
        .sub {
          font-size: 17px;
          line-height: 1.6;
          color: var(--paper-400);
          max-width: 52ch;
          margin: 0;
        }
        .sectionLabel {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--paper-400);
          margin: 0 0 20px;
        }
        .tracks {
          padding: 40px 0;
          border-top: 1px solid var(--ink-800);
        }
        .trackGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .trackCard {
          display: block;
          border: 1px solid var(--ink-800);
          border-radius: 10px;
          padding: 24px;
          background: var(--ink-900);
        }
        .trackCard:hover {
          border-color: var(--cyan-400);
        }
        .trackCard h2 {
          font-size: 20px;
          margin: 0 0 10px;
        }
        .trackCard p {
          font-size: 14px;
          color: var(--paper-400);
          margin: 0 0 16px;
          line-height: 1.5;
        }
        .trackMeta {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--amber-500);
        }
        .footer {
          display: flex;
          padding-top: 32px;
          border-top: 1px solid var(--ink-800);
          font-size: 13px;
          color: var(--paper-400);
        }
        @media (max-width: 760px) {
          h1 { font-size: 34px; }
        }
      `}</style>
    </div>
  );
}