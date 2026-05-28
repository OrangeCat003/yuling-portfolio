"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────

type Tag =
| "All"
| "Education Finance"
| "Enrollment Equity"
| "Comparative Policy"
| "Human Capital"
| "Arts & Education"
| "Labor Economics"
| "Gender & Work"
| "AI Policy";

interface Paper {
  id: number;
  num: string;
  venue: string;
  title: string;
  abstract: string;
  role: string;
  year: string;
  tags: Tag[];
}

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────

const TAGS: Tag[] = [
  "All",
  "Education Finance",
  "Enrollment Equity",
  "Comparative Policy",
  "Human Capital",
  "Arts & Education",
  "Labor Economics",
  "Gender & Work",
  "AI Policy",
];

const PAPERS: Paper[] = [
  {
    id: 1,
    num: "01",
    venue: "CIES 2026 · San Francisco",
    title:
      "The Influence of Parents' Highest Education Level on Students' Aspirations for Higher Education: Evidence from Hong Kong",
    abstract:
      "This paper examines how parental educational attainment shapes the postsecondary aspirations of secondary school students in Hong Kong, drawing on quantitative survey data to identify intergenerational transmission mechanisms across socioeconomic strata.",
    role: "Co-author",
    year: "2026",
    tags: ["Comparative Policy", "Human Capital", "Enrollment Equity"],
  },
  {
    id: 2,
    num: "02",
    venue: "Research Paper · Teachers College, Columbia University",
    title:
      "State Funding Instability, Tuition Growth, and Enrollment Equity: Evidence from SUNY Buffalo and New York State Public Higher Education (2010–2023)",
    abstract:
      "Using SHEEO, IPEDS, and New York State Comptroller data, this paper examines how state appropriation volatility between 2010 and 2023 influenced tuition-setting behavior and equity-related enrollment outcomes at SUNY Buffalo — finding that rising tuition coincided with a high-tuition, high-aid model that expanded diversity even under fiscal pressure.",
    role: "First author",
    year: "2025",
    tags: ["Education Finance", "Enrollment Equity"],
  },
  {
   id: 3, 
   num: "03",
   venue: "Working Paper · Teachers College, Columbia University", 
   title:
   "Generative Al and Women's Labor-Market Vulnerability in China: Theoretical Frameworks, Mechanisms, and Hypotheses from International Literature", 
   abstract: 
   "This paper develops a conceptual framework for understanding whether women’s labor-market vulnerability under generative AI should be seen as a temporary adjustment problem or a structural form of inequality. Focusing on China, it links AI-driven labor substitution with gendered occupational sorting, promotion barriers, and family-related labor constraints, arguing that these mechanisms may become cumulative and self-reinforcing over time.",
   role: "First author",
   year: "2026",
   tags: ["Human Capital", "Labor Economics", "Gender & Work", "AI Policy"],
  },
  {
    id: 4,
    num: "04",
    venue: "ICEIPI 2023",
    title:
      "The Relationship Between the Learning Styles of Chinese Students and the Needs of Chinese Society",
    abstract:
      "A policy-facing analysis examining the mismatch between dominant pedagogical paradigms in Chinese education — which privilege exam performance and rote retention — and the emerging social demand for creativity, adaptability, and socio-emotional competence in the post-industrial labor market.",
    role: "First author",
    year: "2023",
    tags: ["Comparative Policy", "Human Capital"],
  },
  {
    id: 5,
    num: "05",
    venue: "Working Paper · Teachers College, Columbia University",
    title:
      "Why Arts Education Belongs in the Budget: Human Capital, Multiple Intelligences, and the Limits of Standardized Accountability",
    abstract:
      "Drawing on Gardner's Multiple Intelligences Theory, embodied cognition research, and experimental evidence from arts education interventions, this paper argues that the persistent defunding of arts programs in U.S. public schools reflects a measurement failure rather than an evidence-based policy choice.",
    role: "First author",
    year: "2025",
    tags: ["Arts & Education", "Human Capital", "Education Finance"],
  },
  {id: 6,
    num: "06", 
    venue: "Working Paper · Teachers College, Columbia University",
    title:
    "Comparative Review",
    abstract:
    "This comparative review discusses Niederle and Vesterlund (2007) and Exley and Kessler (2022) to examine how gender differences in competition entry, self-assessment, and self-promotion may shape career outcomes. It reflects on why women may remain underrepresented in high-reward or promotion-based settings despite comparable performance.",
    role: "First author",
    year: "2025",
    tags: ["Gender & Work", "Labor Economics"]
  }
];

// ─────────────────────────────────────────────────────────
// SCROLL REVEAL HOOK
// One IntersectionObserver instance, shared across all uses.
// Elements fade up once; never replay.
// ─────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { setRef, visible };
}

// ─────────────────────────────────────────────────────────
// REVEAL WRAPPER — thin shell, no extra DOM weight
// ─────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { setRef, visible } = useReveal();

  return (
    <div
      ref={setRef as React.RefCallback<HTMLDivElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PAPER CARD — expandable abstract
// ─────────────────────────────────────────────────────────

function PaperCard({ paper }: { paper: Paper }) {
  const [open, setOpen] = useState(false);
  const abstractRef = useRef<HTMLParagraphElement>(null);
  const [height, setHeight] = useState(0);

  // Measure real height once on mount so the expand animation
  // knows exactly where to land — no magic numbers.
  useEffect(() => {
    if (abstractRef.current) {
      setHeight(abstractRef.current.scrollHeight);
    }
  }, []);

  return (
    <article
      onClick={() => setOpen((o) => !o)}
      style={{
        padding: "2rem 0",
        borderTop: "1px solid rgba(30,29,27,0.12)",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "0 2rem",
        alignItems: "start",
        cursor: "pointer",
      }}
    >
      {/* number */}
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: "0.85rem",
          color: "var(--ink-faint)",
          paddingTop: "0.2em",
          minWidth: "2rem",
          userSelect: "none",
        }}
      >
        {paper.num}
      </span>

      {/* body */}
      <div>
        <p
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--amber-600)",
            marginBottom: "0.5rem",
          }}
        >
          {paper.venue}
        </p>

        <p
          style={{
            fontFamily: "var(--serif)",
            fontSize: "1.25rem",
            fontWeight: 400,
            lineHeight: 1.4,
            color: "var(--ink)",
            marginBottom: "0.5rem",
          }}
        >
          {paper.title}
        </p>

        {/* abstract — height-animated, no layout shift */}
        <div
          style={{
            overflow: "hidden",
            maxHeight: open ? `${height}px` : "0px",
            transition: "max-height 0.38s ease",
          }}
        >
          <p
            ref={abstractRef}
            style={{
              fontSize: "0.88rem",
              color: "var(--ink-mid)",
              lineHeight: 1.75,
              paddingTop: "0.6rem",
            }}
          >
            {paper.abstract}
          </p>
        </div>

        {/* tag chips — small, below the title */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.75rem" }}>
          {paper.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.25em 0.75em",
                border: "1px solid var(--blue-200)",
                borderRadius: "2em",
                color: "var(--blue-800)",
                background: "var(--blue-50)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          aria-expanded={open}
          style={{
            display: "inline-block",
            marginTop: "0.75rem",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--blue-600)",
            border: "none",
            background: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--sans)",
            transition: "color 0.2s",
          }}
        >
          {open ? "Abstract ↑" : "Abstract ↓"}
        </button>
      </div>

      {/* meta */}
      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--ink-faint)",
          textAlign: "right",
          paddingTop: "0.35em",
          whiteSpace: "nowrap",
        }}
      >
        {paper.role}
        <br />
        {paper.year}
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────
// TAG FILTER BAR
// ─────────────────────────────────────────────────────────

function TagFilter({
  active,
  onChange,
}: {
  active: Tag;
  onChange: (t: Tag) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter research by theme"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "2.5rem",
      }}
    >
      {TAGS.map((tag) => {
        const isActive = tag === active;
        return (
          <button
            key={tag}
            onClick={() => onChange(tag)}
            aria-pressed={isActive}
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.35em 1em",
              borderRadius: "2em",
              border: isActive
                ? "1.5px solid var(--amber-400)"
                : "1px solid rgba(30,29,27,0.15)",
              background: isActive ? "var(--amber-50)" : "transparent",
              color: isActive ? "var(--amber-800)" : "var(--ink-faint)",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              transition: "all 0.18s ease",
            }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────

export default function Page() {
  const [activeTag, setActiveTag] = useState<Tag>("All");

  const visiblePapers =
    activeTag === "All"
      ? PAPERS
      : PAPERS.filter((p) => p.tags.includes(activeTag));

  return (
    <>
      {/* ── GLOBAL STYLES ─────────────────────────────── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --white:       #F5F0E6;
          --parchment:   #FAEEDA;
          --ink:         #1E1D1B;
          --ink-mid:     #4A4844;
          --ink-faint:   #9E9789;
          --rule:        rgba(30,29,27,0.12);
          --serif:       'Cormorant Garamond', Georgia, serif;
          --sans:        'DM Sans', system-ui, sans-serif;
          --zh:          'Noto Serif SC', serif;

          /* amber */
          --amber-50:    #FAEEDA;
          --amber-200:   #EF9F27;
          --amber-400:   #BA7517;
          --amber-600:   #854F0B;
          --amber-800:   #633806;

          /* blue */
          --blue-50:     #E6F1FB;
          --blue-200:    #85B7EB;
          --blue-400:    #378ADD;
          --blue-600:    #185FA5;
          --blue-800:    #0C447C;
        }

        html { scroll-behavior: smooth; font-size: 16px; }

        body {
          background: var(--white);
          color: var(--ink);
          font-family: var(--sans);
          font-weight: 300;
          line-height: 1.75;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* grain overlay — fixed, above everything except modals */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
          opacity: 0.4;
        }

        /* ── NAV ── */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 3rem;
          mix-blend-mode: multiply;
          background: rgba(247, 244, 238, 0.82);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(170, 150, 120, 0.12);
        }
        .nav-sig {
          font-family: var(--serif);
          font-size: 1rem;
          font-weight: 400;
          letter-spacing: 0.01em;
          color: var(--ink);
          text-decoration: none;
        }
        .nav-sig span {
          font-family: var(--zh);
          font-size: 0.85rem;
          margin-left: 0.6em;
          color: var(--ink-mid);
        }
        .nav-links { display: flex; gap: 2rem; }
        .nav-links a {
          font-family: var(--sans);
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ink-mid);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--amber-400); }

        /* ── SECTION SHARED ── */
        section {
          padding: 7rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-rule {
          width: 40px;
          height: 1px;
          background: var(--amber-200);
          margin-bottom: 1.25rem;
        }
        .section-label {
          font-family: var(--sans);
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--amber-600);
          margin-bottom: 3rem;
        }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-rows: 1fr auto;
          padding: 0 14rem;
          position: relative;
          overflow: hidden;
        }
        .hero-bg-text {
          position: absolute;
          bottom: -0.15em;
          right: -0.05em;
          font-family: var(--serif);
          font-size: clamp(8rem, 20vw, 22rem);
          font-weight: 300;
          color: transparent;
          -webkit-text-stroke: 1px rgba(186,117,23,0.07);
          line-height: 1;
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.02em;
          animation: ghostIn 1s ease 0.3s both;
        }
        @keyframes ghostIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 4rem;
          max-width: 820px;
          position: relative;
          z-index: 1;
        }
        .hero-eyebrow {
          font-family: var(--sans);
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--amber-600);
          margin-bottom: 1.5rem;
        }
        .hero-name {
          font-family: var(--serif);
          font-size: clamp(3.5rem, 8vw, 7rem);
          font-weight: 300;
          line-height: 1.0;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 0.2em;
        }
        .hero-name em { font-style: italic; color: var(--ink-mid); }
        .hero-name-zh {
          font-family: var(--zh);
          font-size: 1.1rem;
          font-weight: 300;
          color: var(--ink-faint);
          letter-spacing: 0.3em;
          margin-bottom: 2.5rem;
          display: block;
        }
        .hero-question {
          font-family: var(--serif);
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          font-weight: 400;
          font-style: italic;
          line-height: 1.5;
          color: var(--ink-mid);
          max-width: 600px;
          border-left: 2px solid var(--amber-400);
          padding-left: 1.5rem;
        }
        .hero-footer {
          padding: 1.5rem 0 2.5rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          border-top: 1px solid var(--rule);
          position: relative;
          z-index: 1;
        }
        .hero-footer-tags {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .hero-footer-tags span {
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        .hero-footer-tags span::before {
          content: '—';
          margin-right: 0.5em;
          color: var(--amber-400);
        }
        .scroll-cue {
          margin-left: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          animation: nudge 2.5s ease-in-out infinite;
        }
        .scroll-cue span {
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--ink-faint), transparent);
        }
        @keyframes nudge {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        .skill-orb {
  position: absolute;
  right: 8vw;
  top: 12vh;

  width: 680px;
  height: 680px;

  display: grid;
  place-items: center;
  opacity: 0.95;
  pointer-events: none;
}

.orb-core {
  width: 300px;
  height: 300px;
  border-radius: 75%;

  background:
    radial-gradient(circle,
      rgba(255, 214, 140, 0.92) 0%,
      rgba(236, 163, 60, 0.72) 20%,
      rgba(214, 132, 24, 0.38) 42%,
      rgba(214, 132, 24, 0.12) 68%,
      rgba(214, 132, 24, 0) 88%
    );

  filter: blur(22px);

  box-shadow:
    0 0 120px rgba(236, 163, 60, 0.22),
    0 0 220px rgba(236, 163, 60, 0.16),
    0 0 320px rgba(236, 163, 60, 0.08);

  animation: pulseOrb 6s ease-in-out infinite;
  mix-blend-mode: multiply;
}

.orb-text-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: rotateRing 95s linear infinite;
}

.orb-text-ring text {
  font-family: var(--sans);
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
  fill: rgba(95, 80, 62, 0.36);
}
  .orb-ring-position {
  position: absolute;
  inset: 0;
  transform: translate(35px, -10px);
}
  @keyframes rotateRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
  @keyframes pulseOrb {
  0%, 100% {
    transform: scale(1);
    opacity: 0.86;
    filter: blur(20px);
  }

  45% {
    transform: scale(1.13);
    opacity: 1;
    filter: blur(26px);
  }

  80% {
    transform: scale(1.03);
    opacity: 0.92;
    filter: blur(22px);
  }
}

        /* ── ABOUT ── */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: start;
        }
        .about-statement {
          font-family: var(--serif);
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
          font-weight: 400;
          line-height: 1.55;
          color: var(--ink);
        }
        .about-statement em { color: var(--amber-400); font-style: italic; }
        .about-body {
          font-size: 1rem;
          color: var(--ink-mid);
          line-height: 1.85;
        }
        .about-body p + p { margin-top: 1.2em; }
        .about-thread {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--rule);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .thread-item {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          font-size: 0.85rem;
        }
        .thread-year {
          font-family: var(--serif);
          font-size: 0.9rem;
          color: var(--ink-faint);
          min-width: 3rem;
        }
        .thread-place { color: var(--ink-mid); font-weight: 300; }
        .thread-place strong { font-weight: 500; color: var(--ink); }

        /* ── QUESTIONS ── */
        .question-band {
  padding: 7rem 3rem;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}

.question-title {
  font-family: var(--serif);
  font-size: clamp(2.8rem, 6vw, 6.5rem);
  font-weight: 400;
  line-height: 1.05;
  max-width: 900px;
  margin: 2rem 0 5rem;
  color: var(--ink);
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--rule);
}

.question-card {
  min-height: 320px;
  padding: 2rem;
  border-right: 1px solid var(--rule);
  text-decoration: none;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: background 0.3s ease, transform 0.3s ease;
}

.question-card:last-child {
  border-right: none;
}

.question-card {
  transition: all .4s ease;
}

.question-card:hover {
  background: rgba(109,122,137,0.05);
  box-shadow:
    inset 0 0 60px rgba(55,138,221,0.06);
}

.question-card:hover h3 {
  color: #185FA5;
}

.question-card:hover .question-link {
  color: #185FA5;
}
.question-card span {
  font-family: var(--serif);
  color: var(--ink-faint);
  font-size: 0.9rem;
}

.question-card p {
  font-family: var(--sans);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--amber-400);
}

.question-card h3 {
  font-family: var(--serif);
  font-size: clamp(1.5rem, 2vw, 2.2rem);
  font-weight: 400;
  line-height: 1.25;
  max-width: 360px;
}

.question-card small {
  font-family: var(--sans);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-mid);
}

        /* ── RESEARCH ── */
        .research-intro {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }
        .research-aside {
          font-family: var(--serif);
          font-size: 1.1rem;
          font-weight: 400;
          font-style: italic;
          color: var(--ink-mid);
          line-height: 1.6;
          padding-top: 0.25rem;
        }
        .research-themes {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        /* paper list separator on last item */
        .papers article:last-child {
          border-bottom: 1px solid var(--rule);
        }
        /* ── Research Network ── */
        .research-network {
  margin-top: 2rem;
  position: relative;
}

.network-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.network-svg line {
  stroke: rgba(120, 110, 95, 0.35);
  stroke-width: 1;
  fill: none;

  stroke-dasharray: 8 6;

  animation: drift 12s linear infinite;
}

.network-svg .node circle {
  fill: #f7f4ee;
  stroke: rgba(160, 115, 45, 0.9);
  stroke-width: 1.5;

  transition: all 0.3s ease;
}

.network-svg .node text {
  font-family: var(--sans);
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  fill: rgba(50, 50, 50, 0.88);

  text-transform: uppercase;
}

.network-svg .node:hover circle {
  r: 8;
  filter: drop-shadow(0 0 8px rgba(180,130,60,0.4));
}

@keyframes drift {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -40;
  }
}

        /* ── PROJECTS ── */
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          margin-top: 3rem;
        }
        .project-card {
          background: var(--white);
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--rule);
          transition: background 0.3s;
        }
        .project-card:hover { background: var(--parchment); }
        .project-card.large {
          grid-column: span 2;
          background: var(--ink);
          color: var(--white);
          border-color: var(--ink);
        }
        .project-card.large:hover { background: #2c2b28; }
        .project-type {
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--amber-600);
          margin-bottom: 1rem;
        }
        .project-card.large .project-type { color: var(--amber-200); }
        .project-title {
          font-family: var(--serif);
          font-size: 1.5rem;
          font-weight: 400;
          line-height: 1.3;
          margin-bottom: 1rem;
          color: inherit;
        }
        .project-desc {
          font-size: 0.9rem;
          line-height: 1.75;
          color: var(--ink-mid);
          margin-bottom: 1.5rem;
        }
        .project-card.large .project-desc { color: rgba(245,240,230,0.65); }
        .project-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .project-tag {
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.25em 0.75em;
          border: 1px solid var(--rule);
          border-radius: 2em;
          color: var(--ink-faint);
        }
        .project-card.large .project-tag {
          border-color: rgba(245,240,230,0.2);
          color: rgba(245,240,230,0.5);
        }
        .project-num {
          position: absolute;
          bottom: 2rem;
          right: 2.5rem;
          font-family: var(--serif);
          font-size: 5rem;
          font-weight: 300;
          color: rgba(30,29,27,0.05);
          line-height: 1;
          pointer-events: none;
        }
        .project-card.large .project-num { color: rgba(245,240,230,0.04); }

        /* ── NOW ── */
        .now-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .now-title {
          font-family: var(--serif);
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 300;
          line-height: 1.2;
          color: var(--ink);
          margin-bottom: 1.5rem;
        }
        .now-title em { font-style: italic; color: var(--amber-400); }
        .now-list { list-style: none; display: flex; flex-direction: column; gap: 1.25rem; }
        .now-list li {
          font-size: 0.9rem;
          color: var(--ink-mid);
          line-height: 1.7;
          padding-left: 1.25rem;
          position: relative;
        }
        .now-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 5px;
          height: 1px;
          background: var(--amber-200);
        }
        .now-list li strong { color: var(--ink); font-weight: 500; }
        .now-note {
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--rule);
          font-family: var(--serif);
          font-size: 1rem;
          font-style: italic;
          color: var(--ink-faint);
          line-height: 1.7;
        }

        /* ── CONTACT ── */
        .contact-section {
          background: var(--ink);
          padding: 7rem 3rem;
          position: relative;
          overflow: hidden;
        }
        .contact-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 4rem;
          align-items: end;
        }
        .contact-bg-text {
          position: absolute;
          bottom: -0.15em;
          right: -0.05em;
          font-family: var(--serif);
          font-size: clamp(6rem, 18vw, 18rem);
          font-weight: 300;
          color: transparent;
          -webkit-text-stroke: 1px rgba(66,36,2,0.12);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }
        .contact-headline {
          font-family: var(--serif);
          font-size: clamp(2rem, 4vw, 3.8rem);
          font-weight: 300;
          line-height: 1.2;
          color: var(--white);
          margin-bottom: 1.5rem;
        }
        .contact-headline em { font-style: italic; color: var(--amber-200); }
        .contact-body {
          font-size: 0.95rem;
          color: rgba(245,240,230,0.55);
          line-height: 1.75;
          max-width: 500px;
          margin-bottom: 2.5rem;
        }
        .contact-email {
          display: inline-block;
          font-family: var(--serif);
          font-size: 1.25rem;
          color: var(--white);
          text-decoration: none;
          border-bottom: 1px solid var(--blue-400);
          padding-bottom: 0.1em;
          transition: color 0.2s;
        }
        .contact-email:hover { color: var(--blue-200); }
        .contact-langs {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(245,240,230,0.08);
        }
        .lang-label {
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(245,240,230,0.25);
          margin-bottom: 0.75rem;
        }
        .langs { display: flex; gap: 1.5rem; }
        .lang { font-family: var(--serif); font-size: 1rem; color: var(--amber-200); }
        .lang strong { font-weight: 400; color: var(--amber-200); }
        .contact-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }
        .contact-link {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: none;
          color: rgba(245,240,230,0.35);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: color 0.2s;
        }
        .contact-link:hover { color: var(--amber-200); }
        .contact-link::before {
          content: '';
          display: block;
          width: 20px;
          height: 1px;
          background: currentColor;
        }

        /* ── FOOTER ── */
        footer {
          background: var(--ink);
          border-top: 1px solid rgba(245,240,230,0.06);
          padding: 1.5rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        footer p {
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          color: rgba(245,240,230,0.2);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          nav { padding: 1.25rem 1.5rem; }
          .nav-links { display: none; }
          .hero, section { padding-left: 1.5rem; padding-right: 1.5rem; }
          .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .research-intro { grid-template-columns: 1fr; gap: 2rem; }
          .projects-grid { grid-template-columns: 1fr; }
          .project-card.large { grid-column: span 1; }
          .now-section { grid-template-columns: 1fr; gap: 2.5rem; }
          .contact-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .band { padding-left: 1.5rem; padding-right: 1.5rem; }
          .contact-section { padding-left: 1.5rem; padding-right: 1.5rem; }
          footer { flex-direction: column; gap: 0.5rem; text-align: center; }
        }

        /* reduce motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        /* ── PATHWAYS ── */
        .pathways {
  padding: 6rem 6vw;
}

.pathway-map {
  position: relative;
  height: 58vh;
  min-height: 420px;
  max-height: 620px;
  max-width: 980px;
  margin: 2rem auto 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem 0 4rem;
  scroll-behavior: smooth;
}
  .pathway-map::-webkit-scrollbar {
  width: 6px;
}

.pathway-map::-webkit-scrollbar-thumb {
  background: rgba(160, 115, 45, 0.35);
  border-radius: 999px;
}

.pathway-map::-webkit-scrollbar-track {
  background: transparent;
}

.pathway-map {
  border-top: 1px solid rgba(120, 105, 85, 0.14);
  border-bottom: 1px solid rgba(120, 105, 85, 0.14);
}

.pathway-head {
  position: absolute;
  top: 0;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6f685f;
}

.education-head {
  left: 7%;
}

.experience-head {
  right: 20%;
}

.year-line {
  position: absolute;
  top: 70px;
  left: 50%;
  width: 1px;
  height: 1700px;
  background: rgba(120, 105, 85, 0.2);
}

.year {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #f7f1e7;
  padding: 0.25rem 0.6rem;
  font-family: var(--serif);
  color: #9b8f80;
  font-size: 0.95rem;
  z-index: 2;
}

.y2020 { top: 120px; }
.y2021 { top: 220px; }
.y2022 { top: 320px; }
.y2023 { top: 420px; }

.y2024 { top: 600px; }
.y2025 { top: 1000px; }
.y2026 { top: 1400px; }

.edu-block,
.exp-node {
  position: absolute;
  width: 34%;
  padding: 1.25rem 1.4rem;
  background: rgba(255, 252, 245, 0.82);
  border: 1px solid rgba(120, 105, 85, 0.16);
  border-left: 2px solid rgba(170, 116, 42, 0.55);
}

.edu-block {
  left: 4%;
}

.exp-node {
  right: 4%;
}

.edu-block span,
.exp-node span {
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #aaa095;
}

.edu-block h3,
.exp-node h3 {
  margin: 0;
  font-family: var(--serif);
  font-size: 1.15rem;
  line-height: 1.25;
  color: #1f1d1a;
}

.edu-block p,
.exp-node p {
  margin: 0.35rem 0 0;
  color: #6f685f;
  line-height: 1.45;
}
.edu-sub {
  margin-top: 2.2rem;
  padding-top: 1.2rem;

  border-top: 1px solid rgba(120, 105, 85, 0.12);

  display: flex;
  gap: 1rem;
}

.edu-sub-line {
  width: 2px;
  background: rgba(180, 130, 55, 0.45);
  border-radius: 999px;
}

.edu-sub strong {
  display: block;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(120, 105, 85, 0.7);
  margin-bottom: 0.45rem;
}

.edu-sub p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ink-mid);
}

.blcu { top: 90px; height: 460px;
}
.columbia { top: 640px; height: 360px;
}

.exp-1 { top: 420px; }
.exp-2 { top: 540px; }
.exp-3 { top: 660px; }
.exp-4 { top: 800px; }
.exp-5 { top: 960px; }
.exp-6 { top: 1080px; }
.exp-7 { top: 1200px; }
.exp-8 { top: 1340px; }
.exp-9 { top: 1480px; }
.exp-10 { top: 1620px; }

.edu-block::after,
.exp-node::before {
  content: "";
  position: absolute;
  top: 1.5rem;
  width: 72px;
  height: 1px;
  background: rgba(120, 105, 85, 0.18);
}

.edu-block::after {
  right: -72px;
}

.exp-node {
  min-height: 96px;
  padding: 1rem 1.25rem;
}

.exp-node h3 {
  font-size: 1.05rem;
}
.exp-node p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ink-mid);
}

@media (max-width: 800px) {
  .pathway-map {
    min-height: auto;
  }

  .year-line,
  .year,
  .pathway-head,
  .edu-block::after,
  .exp-node::before {
    display: none;
  }

  .edu-block,
  .exp-node {
    position: relative;
    width: auto;
    left: auto;
    right: auto;
    top: auto;
    margin-bottom: 1rem;
  }
}
      `}</style>

      {/* ── NAV ───────────────────────────────────────── */}
      <nav>
      <a href="#" className="nav-sig">
         Yuling Xu
        <span>｜徐钰玲</span>
      </a>
        <div className="nav-links">
          <a href="#research">Research</a>
          <a href="#projects">Projects</a>
          <a href="#now">Now</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────── */}
      <div className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Researcher · Educator · Storyteller</p>
          <h1 className="hero-name">
            Yuling
            <br />
            <em>Xu</em>
          </h1>
          <span className="hero-name-zh">徐 钰 泠</span>
          <p className="hero-question">
            How do institutions, markets, and technological change shape human potential — and who gets left behind when systems fail to adapt?
          </p>
        </div>
        <div className="hero-footer">
          <div className="hero-footer-tags">
            <span>Beijing · Montpellier · New York</span>
            <span>Education Policy · Labor Markets · AI</span>
          </div>
          <div className="scroll-cue" aria-hidden="true">
            <span>Read</span>
            <div className="scroll-line" />
          </div>
        </div>
        <div className="skill-orb">
  <div className="orb-core" />
  <svg className="orb-text-ring" viewBox="0 0 500 500">
  <defs>
    <path
      id="skillCircle"
      d="M 250,250 m -180,0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0"
    />
  </defs>

  <text>
    <textPath href="#skillCircle" startOffset="0%">
      STATA · SQL · REGRESSION · PANEL DATA · QUANTITATIVE & QUALITATIVE RESEARCH · MARKET RESEARCH · DATA VISUALIZATION · 
    </textPath>
  </text>
</svg>
</div>
      </div>

      {/* ── ABOUT ─────────────────────────────────────── */}
      <section id="about">
        <Reveal>
          <div className="about-body">
            <p>
            I became interested in social questions long before I knew the language of economics.
            </p>
            <p>
            What determines who gets opportunities, who feels allowed to take risks, and who is left behind? Why do some institutions create mobility while others reproduce inequality? These questions led me toward education policy, labor markets, and eventually behavioral economics.
            </p>
            <p>
            I am drawn to questions at the intersection of human behavior, institutions, and technological change. Across education, labor markets, and AI, I am interested in how systems adapt under pressure — and how policy, incentives, and culture influence long-term outcomes for individuals and organizations.
            </p>
            <p>
            I have lived, studied, and worked across China, France, and the United States. Moving between languages and systems taught me that translation is not only linguistic — it is social, institutional, and emotional. Much of my work begins there: in understanding how people navigate worlds that were not originally designed for them.
            </p>
            <p>
            Outside research, I am drawn to environments that demand both discipline and collaboration. I sail competitively, play the violin, and enjoy building projects with people from very different backgrounds. What attracts me most is the process of learning quickly, adapting under pressure, and working collectively toward something ambitious.
            </p>
            <p>
            I care deeply about exploring the world — intellectually, culturally, and physically. I believe curiosity is not separate from rigor; it is what makes rigorous work possible.
            </p>
          </div>
        </Reveal>
      </section>
      <section id="pathways" className="pathways">
  <div className="section-rule" />
  <p className="section-label">Pathways</p>

  <div className="pathway-map">
    <p className="pathway-head education-head">Education</p>
    <p className="pathway-head experience-head">Experience</p>

    <div className="year-line" />

    {["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((year, index) => (
      <div key={year} className={`year y${year}`}>
        {year}
      </div>
    ))}

<div className="edu-block blcu">
  <span>2020–2024</span>

  <h3>Beijing Language and Culture University</h3>
  <p>B.A. Translation, Interpreting, French</p>

  <div className="edu-sub">
    <div className="edu-sub-line"></div>

    <div>
      <strong>2022–2023</strong>
      <p>Université Paul-Valéry Montpellier — Exchange Year, France</p>
    </div>
  </div>
</div>

    <div className="edu-block columbia">
      <span>2024–2026</span>
      <h3>Teachers College, Columbia University</h3>
      <p>M.A. International & Comparative Education</p>
    </div>

    {[
      ["Jul–Aug 2023", "Foreign Language Teaching and Research Press", "Intern Leader"],
      ["Aug–Oct 2023", "UNESCO WHITRAP Beijing", "Research Group Member"],
      ["Oct–Dec 2023", "Embassy of the Republic of France", "Intern, Education & Culture Division"],
      ["Dec 2023–Mar 2024", "Rouse International Limited", "Marketing Intern"],
      ["Nov 2024–May 2025", "EasyTransfer", "Part-time Social Media Contributor"],
      ["Feb–May 2025", "China Institute in America", "Project Intern"],
      ["May–Aug 2025", "SFund", "Investment Intern"],
      ["Sep 2025–Present", "Columbia University EALAC", "Teaching Associate"],
      ["2025–Present", "Research Assistant, Columbia University", "Research Assistant"],
      ["2026–Present", "Project for Peace", "Grant Recipient / Project Lead"],
    ].map((item, index) => (
      <div key={index} className={`exp-node exp-${index + 1}`}>
        <span>{item[0]}</span>
        <h3>{item[1]}</h3>
        <p>{item[2]}</p>
      </div>
    ))}
  </div>
</section>

{/* — QUESTIONS — */}
<section className="question-band">
  <div className="section-rule" />

  <Reveal>
    <p className="section-label">Questions</p>

    <h2 className="question-title">
      The questions that guide my work.
    </h2>

    <div className="question-grid">
      <a href="#research" className="question-card">
        <span>01</span>
        <p>Education & Opportunity</p>
        <h3>How do education systems shape opportunity?</h3>
        <small>Research</small>
      </a>

      <a href="#research" className="question-card">
        <span>02</span>
        <p>Technology & Labor Markets</p>
        <h3>How does technological change reshape labor markets?</h3>
        <small>Research</small>
      </a>

      <a href="#projects" className="question-card">
        <span>03</span>
        <p>Human Potential</p>
        <h3>Why do some people benefit from change while others are left behind?</h3>
        <small>Projects</small>
      </a>
    </div>
  </Reveal>
</section>

      {/* ── RESEARCH ── */}
      <section id="research">
        <div className="section-rule" />
        <p className="section-label">Research</p>

        <Reveal className="research-intro">
          <div>
            <p className="research-aside">
              My work asks whether institutions meant to open doors actually do
              — and for whom.
            </p>
    <div className="research-network">
       <svg
            viewBox="0 0 640 340"
           className="network-svg"
           xmlns="http://www.w3.org/2000/svg"
           >
           <line x1="320" y1="170" x2="120" y2="70" />
           <line x1="320" y1="170" x2="250" y2="55" />
           <line x1="320" y1="170" x2="460" y2="70" />
           <line x1="320" y1="170" x2="520" y2="165" />
           <line x1="320" y1="170" x2="445" y2="270" />
           <line x1="320" y1="170" x2="250" y2="285" />
           <line x1="320" y1="170" x2="110" y2="230" />
           <line x1="120" y1="70" x2="250" y2="55" />
           <line x1="460" y1="70" x2="520" y2="165" />
           <line x1="445" y1="270" x2="250" y2="285" />
           <line x1="110" y1="230" x2="120" y2="70" />
           <g className="node">
      <circle cx="320" cy="170" r="7" />
      <text x="340" y="175">Human Capital</text>
    </g>

    <g className="node">
      <circle cx="120" cy="70" r="6" />
      <text x="138" y="75">Education Finance</text>
    </g>

    <g className="node">
      <circle cx="250" cy="55" r="6" />
      <text x="268" y="60">Enrollment Equity</text>
    </g>

    <g className="node">
      <circle cx="460" cy="70" r="6" />
      <text x="478" y="75">Comparative Policy</text>
    </g>

    <g className="node">
      <circle cx="520" cy="165" r="6" />
      <text x="538" y="170">Arts & Education</text>
    </g>

    <g className="node">
      <circle cx="445" cy="270" r="6" />
      <text x="463" y="275">Labor Economics</text>
    </g>

    <g className="node">
      <circle cx="250" cy="285" r="6" />
      <text x="268" y="290">Gender & Work</text>
    </g>

    <g className="node">
      <circle cx="110" cy="230" r="6" />
      <text x="128" y="235">AI Policy</text>
         </g>
       </svg>
    </div>
    </div>
          <div className="about-body">
            <p>
              I use mixed methods — combining IPEDS, SHEEO, and CFPS panel data
              with qualitative fieldwork and ethnographic attention to
              institutional culture. I am interested in the gap between what
              education systems claim to do and what they actually produce: in
              the lived experience of students navigating structures that were
              designed without them in mind.
            </p>
            <p style={{ marginTop: "1rem" }}>
              My research is comparative by necessity: I grew up in a system
              that optimized for the Gaokao; I studied in France where
              selection happens differently; I now research American public
              higher education. Each vantage point sharpens the others.
            </p>
          </div>
        </Reveal>

        {/* ── TAG FILTER ── */}
        <Reveal delay={80}>
          <TagFilter active={activeTag} onChange={setActiveTag} />
        </Reveal>

        {/* ── PAPER LIST ── */}
        <Reveal delay={120}>
          <div className="papers">
            {visiblePapers.length > 0 ? (
              visiblePapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))
            ) : (
              <p
                style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  color: "var(--ink-faint)",
                  padding: "2rem 0",
                  borderTop: "1px solid var(--rule)",
                }}
              >
                No papers match this theme yet — more coming.
              </p>
            )}
          </div>
        </Reveal>
      </section>

      {/* ── PROJECTS ──────────────────────────────────── */}
      <section id="projects" style={{ paddingTop: "2rem" }}>
        <div className="section-rule" />
        <p className="section-label">Projects</p>
        <p
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(1.2rem,2vw,1.6rem)",
            fontWeight: 400,
            lineHeight: 1.55,
            maxWidth: "640px",
            marginBottom: "0.5rem",
          }}
        >
          Applied work at the edge of research, practice, and cultural
          translation.
        </p>

        <Reveal className="projects-grid">
          <div className="project-card large">
            <p className="project-type">Grant · Peace-building · Community Design</p>
            <h3 className="project-title">Build Peace through Storytelling</h3>
            <p className="project-desc">
              A $10,000 Project for Peace grant, awarded by International House
              NYC, to launch storytelling workshops and a culturally grounded
              card game for Chinese parents and young adults in Shenzhen and
              Guangzhou. The project addresses intergenerational family tension
              and the meaning crisis among Chinese youth — not through therapy
              or abstract counseling, but through participatory narrative
              practice. Participants become authors of their own experience, not
              audiences to someone else's diagnosis.
            </p>
            <div className="project-tags">
              {["International House NYC · 2026", "Storytelling as Method", "Game Design", "China"].map((t) => (
                <span key={t} className="project-tag">{t}</span>
              ))}
            </div>
            <span className="project-num" aria-hidden="true">01</span>
          </div>

          <div className="project-card">
            <p className="project-type">Education · Entrepreneurship</p>
            <h3 className="project-title">Future Workshop</h3>
            <p className="project-desc">
              Co-founded an education program for Chinese students preparing for
              U.S. universities — built on Project-Based Learning principles
              from Columbia's Teachers College, in partnership with CHIFAN (a
              NYC-based nutrition NGO) and GELA (Global ESG Leadership
              Association). The program offers real project experience,
              mentorship, and community: what generic test-prep cannot.
            </p>
            <div className="project-tags">
              {["PjBL", "Cross-cultural", "NYC · 2025"].map((t) => (
                <span key={t} className="project-tag">{t}</span>
              ))}
            </div>
            <span className="project-num" aria-hidden="true">02</span>
          </div>

          <div className="project-card">
            <p className="project-type">Research · Cultural Heritage</p>
            <h3 className="project-title">UNESCO Grand Canal Cultural Mapping</h3>
            <p className="project-desc">
              As a Research Group Member with UNESCO WHITRAP, participated in
              the Grand Canal (Beijing Section) Cultural Mapping public drawing
              project — investigating the construction and operation of public
              cultural spaces on-site, and producing a documentary video on the
              social life of the canal corridor.
            </p>
            <div className="project-tags">
              {["UNESCO WHITRAP", "Beijing · 2023", "Documentary"].map((t) => (
                <span key={t} className="project-tag">{t}</span>
              ))}
            </div>
            <span className="project-num" aria-hidden="true">03</span>
          </div>
        </Reveal>
      </section>

      {/* ── NOW ───────────────────────────────────────── */}
      <section id="now">
        <div className="section-rule" />
        <p className="section-label">Now</p>
        <Reveal className="now-section">
          <div>
            <h2 className="now-title">
              What I am
              <br />
              doing <em>right now</em>
            </h2>
            <p className="now-note">
              Updated May 2026. This section reflects the present — not a
              curated summary, but a live state.
            </p>
          </div>
          <ul className="now-list">
            <li>
            Completing my M.A. in International and Comparative Education at Teachers College, Columbia University (May 2026).
            </li>
            <li>
            Expanding a research framework on AI-driven labor market inequality,
            focusing on gender, institutional incentives, and long-term human
            capital outcomes in China — while preparing the work for publication.

            </li>
            <li>
            Working as a Research Assistant at Columbia, conducting quantitative
            analysis using IPEDS and CFPS datasets on education finance and
           labor-market inequality.
            </li>
            <li>
            Finalizing the card game design and workshop structure for Build Peace through Storytelling, launching in China this summer.
            </li>
            <li>
            Collaborating with students at Columbia SIPA on Global Talk podcast
            conversations around education, policy, and international affairs —
            including participating as a guest speaker.
            </li>
            <li>
            Preparing for a transition into consulting through independent industry
            research across AI, education, labor markets, and organizational
            transformation.
            </li>
            <li>
            Training seriously in competitive sailing — working toward progressing
            from experienced crew to skipper certification.
            </li>
          </ul>
        </Reveal>
      </section>

      {/* ── CONTACT ───────────────────────────────────── */}
      <div className="contact-section" id="contact">
        <div className="contact-bg-text" aria-hidden="true">Hello</div>
        <div className="contact-inner">
        <div style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
            <h2 className="contact-headline">
              Interested in 
              <br />
              <em>education, labor markets, and human development?</em>
            </h2>
            <p className="contact-body">
            I welcome conversations about research collaborations,
            strategy projects, education ventures, and opportunities
            to build systems that expand human potential.

            </p>
            <a href="mailto:amandaxu2020@outlook.com" className="contact-email">
              amandaxu2020@outlook.com
            </a>
            <div className="contact-langs">
              <p className="lang-label">Languages</p>
              <div className="langs">
                <span className="lang"><strong>中文</strong> Native</span>
                <span className="lang"><strong>English</strong> Fluent</span>
                <span className="lang"><strong>Français</strong> DALF C1</span>
              </div>
            </div>
          </Reveal>
          </div>
          <div className="contact-links">
            <a href="https://www.linkedin.com/in/yuling-xu-5b8523327/"
  target="_blank"
  rel="noopener noreferrer"
  className="contact-link"
>LinkedIn</a>
            <a href="/YulingXu-CV.pdf"
  download
  className="contact-link">CV (PDF)</a>
            <a href="mailto:amandaxu2020@outlook.com" className="contact-link">
              amandaxu2020@outlook.com
            </a>
          </div>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer>
        <p>© 2026 Yuling Xu 徐钰泠</p>
        <p>New York · Beijing · Montpellier</p>
      </footer>
    </>
  );
}
