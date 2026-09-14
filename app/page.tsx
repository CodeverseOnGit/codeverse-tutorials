import { getNavTree } from '@/lib/content';
import Link from 'next/link';

export default function LandingPage() {
  const modules = getNavTree();
  const totalChapters = modules.reduce((sum, m) => sum + m.chapters.length, 0);
  const milestones = modules
    .flatMap((m) => m.chapters.filter((c) => c.milestone).map((c) => ({ ...c, moduleTitle: m.title })))
    .slice(0, 6);

  return (
    <div className="page">
      {/* ---------- NAV ---------- */}
      <header className="nav">
        <Link href="/" className="brand">
          <img src="/logo.svg" alt="" width={28} height={28} />
          <span>codeverse</span>
        </Link>
        <Link href="/cloud-native-development" className="navCta">
          Start the path
        </Link>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="heroText">
          <p className="kicker">cloud native developer path</p>
          <h1>
            Learn the systems behind
            <br />
            every deploy.
          </h1>
          <p className="sub">
            Nine modules, thirty-four chapters, one production-grade
            capstone. Go from a bare Linux shell to running your own
            observable, secured, auto-deployed platform — writing and
            shipping something real at every stage.
          </p>
          <div className="heroActions">
            <Link href="/cloud-native-development" className="primaryBtn">
              Start the path
            </Link>
            <span className="heroMeta">
              {modules.length} modules · {totalChapters} chapters
            </span>
          </div>
        </div>

        <div className="heroGraph" aria-hidden="true">
          <TopologyDiagram moduleCount={modules.length} />
        </div>
      </section>

      {/* ---------- PIPELINE STRIP ---------- */}
      <section className="pipeline">
        <p className="sectionLabel">the path, in order</p>
        <div className="pipelineTrack">
          {modules.map((m, i) => (
            <Link
              key={m.slug}
              href={`/cloud-native-development/${m.slug}/${m.chapters[0]?.slug ?? ''}`}
              className="pipelineNode"
            >
              <span className="pipelineIndex">{String(i + 1).padStart(2, '0')}</span>
              <span className="pipelineTitle">{m.title}</span>
              {i < modules.length - 1 && <span className="pipelineArrow">→</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- MILESTONES TERMINAL ---------- */}
      <section className="milestones">
        <p className="sectionLabel">what you'll ship</p>
        <div className="terminal">
          <div className="terminalHead">milestones.sh</div>
          <pre className="terminalBody">
{milestones.length > 0
  ? milestones
      .map(
        (m) =>
          `$ ship ${m.moduleSlug}/${m.slug}\n  ✓ ${m.title}\n`
      )
      .join('')
  : `$ ship 01-foundations/01-linux-shell-networking
  ✓ Personal shell cheat-sheet repo

$ ship 02-containers/05-docker-fundamentals
  ✓ Containerized full-stack app

$ ship 03-kubernetes-core/09-kubernetes-architecture
  ✓ App deployed to a local cluster with Helm
`}
          </pre>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="stats">
        <div className="stat">
          <span className="statNum">{modules.length}</span>
          <span className="statLabel">modules</span>
        </div>
        <div className="stat">
          <span className="statNum">{totalChapters}</span>
          <span className="statLabel">chapters</span>
        </div>
        <div className="stat">
          <span className="statNum">1</span>
          <span className="statLabel">capstone platform</span>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        <div className="brand">
          <img src="/logo.svg" alt="" width={20} height={20} />
          <span>codeverse</span>
        </div>
        <Link href="/cloud-native-development">cloud-native-development</Link>
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
        .navCta {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--paper-100);
          border: 1px solid var(--ink-700);
          padding: 8px 16px;
          border-radius: 6px;
        }
        .navCta:hover {
          border-color: var(--cyan-400);
        }

        .hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 48px;
          align-items: center;
          padding: 56px 0 88px;
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
          max-width: 46ch;
          margin: 0 0 32px;
        }
        .heroActions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .primaryBtn {
          font-family: var(--font-mono);
          font-size: 14px;
          background: var(--amber-500);
          color: var(--ink-950);
          padding: 12px 22px;
          border-radius: 6px;
          font-weight: 600;
        }
        .heroMeta {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--paper-400);
        }
        .heroGraph {
          display: flex;
          justify-content: center;
        }

        .sectionLabel {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--paper-400);
          margin: 0 0 20px;
        }

        .pipeline {
          padding: 40px 0;
          border-top: 1px solid var(--ink-800);
        }
        .pipelineTrack {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          align-items: center;
        }
        .pipelineNode {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
        }
        .pipelineIndex {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--amber-500);
        }
        .pipelineTitle {
          font-size: 14px;
          color: var(--paper-100);
          margin-right: 14px;
        }
        .pipelineNode:hover .pipelineTitle {
          color: var(--cyan-400);
        }
        .pipelineArrow {
          color: var(--ink-700);
          margin-right: 14px;
        }

        .milestones {
          padding: 40px 0;
          border-top: 1px solid var(--ink-800);
        }
        .terminal {
          background: var(--ink-900);
          border: 1px solid var(--ink-800);
          border-radius: 10px;
          overflow: hidden;
        }
        .terminalHead {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--paper-400);
          padding: 10px 16px;
          border-bottom: 1px solid var(--ink-800);
        }
        .terminalBody {
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.7;
          color: var(--paper-100);
          padding: 20px;
          margin: 0;
          overflow-x: auto;
        }

        .stats {
          display: flex;
          gap: 56px;
          padding: 48px 0;
          border-top: 1px solid var(--ink-800);
        }
        .stat {
          display: flex;
          flex-direction: column;
        }
        .statNum {
          font-family: var(--font-mono);
          font-size: 32px;
          color: var(--cyan-400);
          font-weight: 600;
        }
        .statLabel {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--paper-400);
        }

        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 32px;
          border-top: 1px solid var(--ink-800);
          font-size: 13px;
          color: var(--paper-400);
        }

        @media (max-width: 760px) {
          .hero {
            grid-template-columns: 1fr;
          }
          h1 {
            font-size: 34px;
          }
          .stats {
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
}

// A one-shot animated topology diagram: nodes representing modules,
// connected by a single path that draws itself in on load. This is
// the hero visual — grounded in the subject (a cluster/pipeline graph)
// rather than a generic illustration.
function TopologyDiagram({ moduleCount }: { moduleCount: number }) {
  const nodes = Array.from({ length: Math.min(moduleCount, 9) }, (_, i) => {
    const angle = (i / Math.min(moduleCount, 9)) * Math.PI * 2 - Math.PI / 2;
    const r = 120;
    return {
      x: 170 + Math.cos(angle) * r,
      y: 170 + Math.sin(angle) * r,
    };
  });

  const pathD = nodes
    .map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`)
    .join(' ') + ' Z';

  return (
    <svg width="340" height="340" viewBox="0 0 340 340" fill="none">
      <path d={pathD} stroke="#1b2438" strokeWidth="1.5" fill="none" />
      <path
        d={pathD}
        stroke="#67e8f9"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="900"
        strokeDashoffset="900"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="900"
          to="0"
          dur="1.8s"
          fill="freeze"
          calcMode="spline"
          keySplines="0.2 0 0.1 1"
        />
      </path>
      <circle cx="170" cy="170" r="3" fill="#8b96ac" />
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === nodes.length - 1 ? 6 : 4.5}
          fill={i === nodes.length - 1 ? '#ffb454' : '#0a0f1c'}
          stroke={i === nodes.length - 1 ? '#ffb454' : '#67e8f9'}
          strokeWidth="1.6"
        />
      ))}
    </svg>
  );
}
