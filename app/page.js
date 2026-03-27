'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './home.module.css';
import HUDCorners from './components/HUDCorners';
import VerdictPill from './components/VerdictPill';

// ===== TICKER DATA =====
const tickerData = [
  { sym: '30YR FXD', val: '6.85%', chg: '+0.15', dir: 'up' },
  { sym: 'MED PRICE', val: '$485K', chg: '+1.8%', dir: 'up' },
  { sym: 'INVENTORY', val: '4.2M', chg: '-2.1%', dir: 'down' },
  { sym: 'AVG DOM', val: '28', chg: '+3.2%', dir: 'up' },
  { sym: 'SUPPLY MOI', val: '8.3', chg: '+0.4', dir: 'up' },
  { sym: 'HSG STARTS', val: '1.42M', chg: '-3.1%', dir: 'down' },
  { sym: 'BLDG PMTS', val: '1.51M', chg: '+1.2%', dir: 'up' },
];

// ===== STATS DATA =====
const statsData = [
  { icon: '\u25A0', num: '4.2M', label: 'Active Listings', chg: '\u25BC 2.1% MoM', dir: 'down' },
  { icon: '\u25B2', num: '8.3', label: 'Months of Supply', chg: '\u25B2 0.4 MoM', dir: 'up' },
  { icon: '\u25C6', num: '$485K', label: 'Median Sale Price', chg: '\u25B2 1.8% YoY', dir: 'up' },
  { icon: '\u2336', num: '28', label: 'Avg Days on Market', chg: '\u25B2 3.2% MoM', dir: 'up' },
];

// ===== PREDICTIONS DATA =====
const predictions = [
  {
    title: 'Mortgage Rates Dip Below 6.5% by Q2 2026',
    status: 'active',
    claim: '"Economic cooling will push the Fed toward rate cuts sooner than expected."',
    meta: ['Made 60 days ago', 'Expires in 85 days'],
    pct: 78,
    elapsed: 71,
    timeLabel: ['71% ELAPSED', '85 DAYS LEFT'],
  },
  {
    title: "Major Tech Hubs Enter Buyer's Market by EOQ2",
    status: 'active',
    claim: '"SF, NYC, and Austin will see 7+ months inventory by end of Q2."',
    meta: ['Made 30 days ago', 'Expires in 115 days'],
    pct: 64,
    elapsed: 26,
    timeLabel: ['26% ELAPSED', '115 DAYS LEFT'],
  },
  {
    title: 'Institutional Buyers Retreat 35% YoY',
    status: 'correct',
    claim: '"Rising rates and tight spread margins will slow institutional acquisition."',
    meta: ['Made 180 days ago', 'Resolved 45 days ago'],
    pct: 92,
    elapsed: 100,
    timeLabel: ['RESOLVED', 'CORRECT'],
  },
];

// ===== CREATORS DATA =====
const creators = [
  {
    initials: 'KM',
    name: 'Ken McElroy',
    role: 'Multifamily Investor \u2022 Author',
    metrics: [
      { name: 'Accuracy', val: 76 },
      { name: 'Consistency', val: 82 },
      { name: 'Conviction Calibration', val: 71 },
      { name: 'Behavioral Authenticity', val: 88 },
      { name: 'Fear Mongering Index', val: 22, fear: true },
    ],
    verdict: 'reliable',
    verdictText: 'HIGHLY RELIABLE',
    claims: 52,
  },
  {
    initials: 'GS',
    name: 'Graham Stephan',
    role: 'Finance Creator \u2022 RE Investor',
    metrics: [
      { name: 'Accuracy', val: 68 },
      { name: 'Consistency', val: 74 },
      { name: 'Conviction Calibration', val: 59 },
      { name: 'Behavioral Authenticity', val: 72 },
      { name: 'Fear Mongering Index', val: 45, fear: true },
    ],
    verdict: 'mixed',
    verdictText: 'MIXED SIGNALS',
    claims: 41,
  },
  {
    initials: 'MK',
    name: 'Meet Kevin',
    role: 'Finance \u2022 Housing Market Analysis',
    metrics: [
      { name: 'Accuracy', val: 54 },
      { name: 'Consistency', val: 38 },
      { name: 'Conviction Calibration', val: 42 },
      { name: 'Behavioral Authenticity', val: 61 },
      { name: 'Fear Mongering Index', val: 78, fear: true },
    ],
    verdict: 'caution',
    verdictText: 'USE CAUTION',
    claims: 67,
  },
];

// ===== FEED DATA =====
const feedItems = [
  {
    verdict: 'supported',
    icon: '\u2713',
    claim: '"Institutional buyers are pulling back from single-family acquisitions due to margin compression."',
    analysis: 'Analysis confirms: Institutional purchase volume down 34% YoY in Feb 2026. Rate stability has squeezed spread margins to historical lows, making conservative underwriting impossible at previous price points.',
    tags: ['INSTITUTIONAL', 'MARKET DYNAMICS'],
    creator: { initials: 'KM', name: 'Ken McElroy', date: 'Mar 18' },
  },
  {
    verdict: 'contradicted',
    icon: '\u2717',
    claim: '"Mortgage rates will fall below 5% within 30 days due to Fed pivot."',
    analysis: '30-day period elapsed. Current 30-yr fixed: 6.72%, well above the 5% prediction. Fed has maintained hawkish stance with no pivot signals. Claim fully contradicted by data.',
    tags: ['RATES', 'MACRO'],
    creator: { initials: 'MK', name: 'Meet Kevin', date: 'Mar 5' },
  },
  {
    verdict: 'supported',
    icon: '\u2713',
    claim: '"Tech hub markets are converting to buyer\'s markets with 6+ months inventory."',
    analysis: 'Confirmed: SF, Austin, Seattle all show 6.2-7.8 months MOI as of Mar 2026. Market conditions have shifted dramatically toward buyers in these metros.',
    tags: ['INVENTORY', 'REGIONAL'],
    creator: { initials: 'GS', name: 'Graham Stephan', date: 'Mar 12' },
  },
  {
    verdict: 'mixed',
    icon: '\u2014',
    claim: '"Price adjustments in high-tier markets will accelerate before spring peak season."',
    analysis: 'Partially confirmed: List price cuts up 28% in $1M+ segment (Jan-Mar 2026 vs. prior year). However, closed sale prices have held within 2% of ask, suggesting negotiation dynamics rather than structural decline.',
    tags: ['PRICING', 'LUXURY'],
    creator: { initials: 'KM', name: 'Ken McElroy', date: 'Mar 8' },
  },
];

// ===== GAUGE COMPONENT =====
function ConfidenceGauge({ pct }) {
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className={styles.gaugeRing}>
      <svg viewBox="0 0 72 72" className={styles.gaugeSvg}>
        <circle className={styles.gaugeTrack} cx="36" cy="36" r="30" />
        <circle
          className={styles.gaugeFill}
          cx="36" cy="36" r="30"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={styles.gaugePct}>{pct}%</span>
    </div>
  );
}

// ===== COUNT-UP HOOK =====
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const inc = Math.max(1, Math.ceil(target / 50));
          const timer = setInterval(() => {
            start += inc;
            if (start >= target) {
              start = target;
              clearInterval(timer);
            }
            setValue(start);
          }, duration / 50);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [ref, value];
}

// ===== MAIN PAGE =====
export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [refPred, countPred] = useCountUp(847);
  const [refCreators, countCreators] = useCountUp(36);
  const [refData, countData] = useCountUp(98);
  const [refAcc, countAcc] = useCountUp(67);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'OMD V2 Homepage' }),
      });
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
  };

  return (
    <>
      {/* ===== NORTH STAR PREDICTION ===== */}
      <section className={styles.northStarSection}>
        <div className="section-tag">
          <div className="bar"></div>
          <span>⬥ North Star Prediction</span>
        </div>

        <div className={styles.northStarCard}>
          <HUDCorners />

          <div className={styles.northStarTop}>
            <div>
              <h2 className={`${styles.northStarHeadline} tactical-heading`}>
                THE INVENTORY SPIKE IS COMING.
              </h2>
              <p className={styles.northStarDesc}>
                Our AI detects a 12-15% national inventory surge by Q3, finally breaking the supply-lock that's defined this cycle.
              </p>
            </div>
            <div className={styles.horizonPill}>HORIZON: SEPT 2026</div>
          </div>

          <div className={styles.calibrationRow}>
            <div>
              <div className={styles.calibrationLabel}>CALIBRATION STATUS</div>
              <div className={styles.calibrationText}>ON TRACK // 84%</div>
            </div>
            <div className={styles.calibrationBar}>
              <div className={styles.calibrationFill} style={{ width: '84%' }} />
            </div>
          </div>

          <div className={styles.northStarBgIcon}>📍</div>
        </div>
      </section>

      {/* ===== DAILY SIGNAL ===== */}
      <section className={styles.dailySignalSection}>
        <div className="section-tag">
          <div className="bar"></div>
          <span>⚡ The Daily Signal</span>
        </div>

        <div className={styles.signalGrid}>
          <div className={`${styles.signalCard} ${styles.signalSupported}`}>
            <div className={styles.signalBorder} />
            <div className={styles.signalHeadline}>INSTITUTIONAL RETREAT CONFIRMED</div>
            <div className={styles.signalDesc}>
              Purchase volume down 34% YoY as margin compression makes acquisitions unworkable at previous pricing.
            </div>
            <VerdictPill type="SUPPORTED" />
          </div>

          <div className={`${styles.signalCard} ${styles.signalMixed}`}>
            <div className={styles.signalBorder} />
            <div className={styles.signalHeadline}>PRICE ADJUSTMENTS ACCELERATING</div>
            <div className={styles.signalDesc}>
              List cuts up 28% in luxury ($1M+) but closed prices holding—negotiation dynamics vs. structural decline.
            </div>
            <VerdictPill type="MIXED" />
          </div>
        </div>
      </section>

      {/* ===== QUICK NAV GRID ===== */}
      <section className={styles.quickNavSection}>
        <div className={styles.quickNavGrid}>
          <a href="/market" className={styles.quickNavItem}>
            <div className={styles.quickNavIcon}>▦</div>
            <div className={styles.quickNavLabel}>Market Data</div>
          </a>
          <a href="/predictions" className={styles.quickNavItem}>
            <div className={styles.quickNavIcon}>◎</div>
            <div className={styles.quickNavLabel}>Predictions</div>
          </a>
          <a href="/creators" className={styles.quickNavItem}>
            <div className={styles.quickNavIcon}>👤</div>
            <div className={styles.quickNavLabel}>Creators</div>
          </a>
          <a href="/feed" className={styles.quickNavItem}>
            <div className={styles.quickNavIcon}>⚡</div>
            <div className={styles.quickNavLabel}>Analysis Feed</div>
          </a>
        </div>
      </section>

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroOrb1}></div>
        <div className={styles.heroOrb2}></div>
        <div className={styles.heroOrb3}></div>

        {/* SVG Skyline */}
        <svg className={styles.heroSkyline} viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4A853" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D4A853" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="50" y="120" width="60" height="180" fill="url(#skyG)" />
          <rect x="120" y="80" width="45" height="220" fill="url(#skyG)" />
          <rect x="175" y="150" width="50" height="150" fill="url(#skyG)" />
          <rect x="240" y="60" width="35" height="240" fill="url(#skyG)" />
          <rect x="285" y="100" width="55" height="200" fill="url(#skyG)" />
          <rect x="360" y="40" width="40" height="260" fill="url(#skyG)" />
          <rect x="410" y="130" width="60" height="170" fill="url(#skyG)" />
          <rect x="490" y="70" width="50" height="230" fill="url(#skyG)" />
          <rect x="560" y="110" width="35" height="190" fill="url(#skyG)" />
          <rect x="610" y="50" width="55" height="250" fill="url(#skyG)" />
          <rect x="680" y="90" width="45" height="210" fill="url(#skyG)" />
          <rect x="740" y="30" width="60" height="270" fill="url(#skyG)" />
          <rect x="815" y="100" width="40" height="200" fill="url(#skyG)" />
          <rect x="870" y="60" width="50" height="240" fill="url(#skyG)" />
          <rect x="935" y="120" width="55" height="180" fill="url(#skyG)" />
          <rect x="1005" y="45" width="40" height="255" fill="url(#skyG)" />
          <rect x="1060" y="80" width="60" height="220" fill="url(#skyG)" />
          <rect x="1135" y="110" width="45" height="190" fill="url(#skyG)" />
          <rect x="1195" y="55" width="50" height="245" fill="url(#skyG)" />
          <rect x="1260" y="90" width="55" height="210" fill="url(#skyG)" />
          <rect x="1330" y="70" width="60" height="230" fill="url(#skyG)" />
        </svg>

        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>
            <div className={styles.eyebrowLine}></div>
            <span>AI-Powered Real Estate Intelligence</span>
            <div className={styles.eyebrowLine}></div>
          </div>

          <h1 className={styles.heroHeadline}>
            KNOW WHAT&apos;S<br />
            <span className={styles.accent}>ACTUALLY</span><br />
            HAPPENING
          </h1>

          <p className={styles.heroSub}>
            Public predictions. Public accountability. Every claim pressure-tested against real market data. No agenda.
          </p>

          <div className={styles.heroActions}>
            <a href="#subscribe" className="btn-gold">GET THE DAILY BRIEF</a>
            <a href="/market" className="btn-outline">EXPLORE THE DATA</a>
          </div>

          <div className={styles.heroStatsRow}>
            <div className={styles.heroStat}>
              <div ref={refPred} className={styles.heroStatNum}>{countPred.toLocaleString()}</div>
              <div className={styles.heroStatLabel}>Predictions Tracked</div>
            </div>
            <div className={styles.heroStat}>
              <div ref={refCreators} className={styles.heroStatNum}>{countCreators}</div>
              <div className={styles.heroStatLabel}>Creators Monitored</div>
            </div>
            <div className={styles.heroStat}>
              <div ref={refData} className={styles.heroStatNum}>{countData}K+</div>
              <div className={styles.heroStatLabel}>Data Points</div>
            </div>
            <div className={styles.heroStat}>
              <div ref={refAcc} className={styles.heroStatNum}>{countAcc}%</div>
              <div className={styles.heroStatLabel}>Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TICKER ===== */}
      <div className={styles.tickerWrap}>
        <div className={styles.tickerTrack}>
          {[...tickerData, ...tickerData].map((t, i) => (
            <div key={i} className={styles.tickGroup}>
              <div className={styles.tick}>
                <span className={styles.tickSym}>{t.sym}</span>
                <span className={styles.tickVal}>{t.val}</span>
                <span className={`${styles.tickChg} ${styles[t.dir]}`}>{t.chg}</span>
              </div>
              <div className={styles.tickDivider}></div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== KEY METRICS ===== */}
      <section id="market" className={styles.section}>
        <div className="section-tag">
          <div className="bar"></div>
          <span>Market Snapshot</span>
        </div>
        <h2 className="section-title">KEY METRICS</h2>
        <p className="section-desc">Real-time housing market indicators from FRED, BLS, Zillow, and MLS data. No spin. Just numbers.</p>

        <div className={styles.statsGrid}>
          {statsData.map((s, i) => (
            <div key={i} className={styles.statBlock}>
              <div className={styles.statBlockIcon}>{s.icon}</div>
              <div className={styles.statBlockNum}>{s.num}</div>
              <div className={styles.statBlockLabel}>{s.label}</div>
              <div className={`${styles.statBlockChange} ${styles[s.dir]}`}>{s.chg}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PREDICTION ENGINE ===== */}
      <section id="predictions" className={styles.section}>
        <div className="section-tag">
          <div className="bar"></div>
          <span>Prediction Engine</span>
        </div>
        <h2 className="section-title">PUBLIC PREDICTIONS.<br />PUBLIC ACCOUNTABILITY.</h2>
        <p className="section-desc">We make specific, timestamped market predictions — then publicly grade ourselves. Right or wrong.</p>

        <div className={styles.predGrid}>
          {predictions.map((p, i) => (
            <div key={i} className={styles.predCard}>
              <div className={styles.predCardTop}>
                <div className={styles.predTitle}>{p.title}</div>
                <div className={`${styles.predStatus} ${styles[p.status]}`}>
                  {p.status === 'correct' ? 'CORRECT \u2713' : 'ACTIVE'}
                </div>
              </div>
              <div className={styles.predBody}>
                <div className={styles.predClaim}>{p.claim}</div>
                <div className={styles.predMeta}>
                  {p.meta.map((m, j) => <span key={j}>{m}</span>)}
                </div>
                <div className={styles.gaugeRow}>
                  <ConfidenceGauge pct={p.pct} />
                  <div className={styles.gaugeInfo}>
                    <div className={styles.gaugeLabel}>CONFIDENCE LEVEL</div>
                    <div className={styles.timeBar}>
                      <div className={styles.timeBarFill} style={{ width: `${p.elapsed}%` }}></div>
                    </div>
                    <div className={styles.timeLabel}>
                      <span>{p.timeLabel[0]}</span>
                      <span>{p.timeLabel[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Accuracy Banner */}
        <div className={styles.accuracyBanner}>
          <div className={styles.accuracyPill}>67%</div>
          <div>
            <div className={styles.accuracyTag}>Lifetime Prediction Accuracy</div>
            <div className={styles.accuracySub}>847 predictions tracked across all categories</div>
          </div>
        </div>
      </section>

      {/* ===== CREATOR CREDIBILITY ===== */}
      <section id="creators" className={styles.section}>
        <div className="section-tag">
          <div className="bar"></div>
          <span>Creator Intelligence</span>
        </div>
        <h2 className="section-title">WHO&apos;S ACTUALLY<br />RIGHT?</h2>
        <p className="section-desc">Every claim from major RE influencers tracked, timestamped, and graded against real market data.</p>

        <div className={styles.creatorGrid}>
          {creators.map((c, i) => (
            <div key={i} className={styles.crCard}>
              <div className={styles.crTop}>
                <div className={styles.crAvatar}>{c.initials}</div>
                <div>
                  <div className={styles.crName}>{c.name}</div>
                  <div className={styles.crRole}>{c.role}</div>
                </div>
              </div>
              <div className={styles.crMetrics}>
                {c.metrics.map((m, j) => (
                  <div key={j} className={styles.crMetric}>
                    <div className={styles.crMetricHead}>
                      <span className={styles.crMetricName}>{m.name}</span>
                      <span className={styles.crMetricVal}>{m.val}%</span>
                    </div>
                    <div className={styles.crBar}>
                      <div
                        className={`${styles.crBarFill} ${m.fear ? styles.fear : ''}`}
                        style={{ width: `${m.val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.crBottom}>
                <div className={`${styles.crVerdict} ${styles[c.verdict]}`}>{c.verdictText}</div>
                <div className={styles.crClaims}>{c.claims} CLAIMS</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ANALYSIS FEED ===== */}
      <section id="feed" className={styles.section}>
        <div className="section-tag">
          <div className="bar"></div>
          <span>Analysis Feed</span>
        </div>
        <h2 className="section-title">CLAIMS VS. DATA</h2>
        <p className="section-desc">Every headline claim pressure-tested against actual market data. Four verdicts: Supported, Contradicted, Mixed, Insufficient Data.</p>

        <div className={styles.feedStack}>
          {feedItems.map((f, i) => (
            <div key={i} className={styles.feedItem}>
              <div className={styles.feedVerdictCol}>
                <div className={`${styles.feedVerdictIcon} ${styles[f.verdict]}`}>{f.icon}</div>
                <div className={`${styles.feedVerdictText} ${styles[f.verdict]}`}>
                  {f.verdict === 'supported' ? 'Supported' : f.verdict === 'contradicted' ? 'Contradicted' : 'Mixed'}
                </div>
              </div>
              <div className={styles.feedBody}>
                <div className={styles.feedClaimText}>{f.claim}</div>
                <div className={styles.feedAnalysisText}>{f.analysis}</div>
                <div className={styles.feedBottom}>
                  <div className={styles.feedTags}>
                    {f.tags.map((t, j) => <div key={j} className={styles.feedTagItem}>{t}</div>)}
                  </div>
                  <div className={styles.feedCreatorTag}>
                    <div className={styles.feedCrAv}>{f.creator.initials}</div>
                    {f.creator.name} &bull; {f.creator.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <div id="subscribe" className={styles.ctaBand}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaHeadline}>YOUR DAILY EDGE.</h2>
          <p className={styles.ctaSub}>Every morning: the numbers that matter, the predictions that moved, and the claims that got tested. One email. No agenda.</p>
          {submitted ? (
            <div className={styles.ctaSuccess}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{'\u2713'}</div>
              <div>You&apos;re on the list. Intelligence incoming.</div>
            </div>
          ) : (
            <form className={styles.ctaForm} onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">GET INTEL</button>
            </form>
          )}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerLogoText}>OFF MARKET DAILY</div>
              <p className={styles.footerBrandText}>
                AI-powered real estate intelligence. Every prediction tracked. Every claim tested. Every influencer graded.
              </p>
            </div>
            <div className={styles.footerCol}>
              <h5>PLATFORM</h5>
              <ul>
                <li><a href="/market">Market Data</a></li>
                <li><a href="/predictions">Predictions</a></li>
                <li><a href="/creators">Creators</a></li>
                <li><a href="/feed">Analysis Feed</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h5>COMPANY</h5>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className={styles.footerCol}>
              <h5>LEGAL</h5>
              <ul>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Disclaimer</a></li>
                <li><a href="#">API</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerLine}>
            <div className={styles.footerCopy}>&copy; 2026 Off Market Daily. All rights reserved.</div>
            <div className={styles.footerSocials}>
              <a href="#">X</a>
              <a href="#">YT</a>
              <a href="#">IG</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
