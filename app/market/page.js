'use client';

import { useEffect, useState } from 'react';
import HUDCorners from '../components/HUDCorners';
import styles from './market.module.css';

// ===== INTELLIGENCE LAYER =====
// What each indicator IS, why it matters, and how to read the signal

const SERIES_CONTEXT = {
  MORTGAGE30US: {
    what: 'The average rate on a 30-year fixed mortgage — the most common loan type in the US.',
    whyItMatters: 'This is the single biggest driver of buyer demand. Every 1% increase eliminates roughly 10% of qualified buyers from the market.',
    getSignal: (value, change) => {
      if (value < 6.0) return { label: 'STRONG BUY SIGNAL', tone: 'bullish', text: `At ${value}%, buyer demand is heating up. Expect competition to increase and days on market to shrink. If you're acquiring, move fast before prices adjust upward.` };
      if (value < 6.5) return { label: 'FAVORABLE', tone: 'bullish', text: `Sub-6.5% opens the door for more buyers. Good time to sell or assign — buyer pool is expanding. If acquiring, factor in rising competition.` };
      if (value < 7.0) return { label: 'NEUTRAL', tone: 'neutral', text: `${value}% is livable but not exciting. Buyers are active but cautious. Sellers are more negotiable here — good window for off-market acquisitions at discount.` };
      if (value < 7.5) return { label: 'BUYER HESITATION', tone: 'bearish', text: `Above 7% pushes monthly payments past comfort zones. Expect longer days on market and more price reductions. Stronger negotiating position for acquisitions.` };
      return { label: 'DEMAND COMPRESSION', tone: 'bearish', text: `${value}% is squeezing buyers hard. Many are sidelined. Sellers get desperate — prime environment for deep-discount acquisitions, but your buyer pool for exits is smaller.` };
    },
  },
  MORTGAGE15US: {
    what: 'The average rate on a 15-year fixed mortgage — used by buyers who can handle higher payments for faster equity.',
    whyItMatters: 'Tracks closely with the 30-year but signals investor and move-up buyer activity. Investors with capital often prefer 15-year for cashflow properties.',
    getSignal: (value, change) => {
      const spread = 'Tracks with the 30-year. ';
      if (value < 5.5) return { label: 'ATTRACTIVE', tone: 'bullish', text: spread + 'Investors can lock strong cashflow with aggressive paydown at these rates.' };
      if (value < 6.0) return { label: 'WORKABLE', tone: 'neutral', text: spread + 'Still pencils for buy-and-hold strategies with strong cash-on-cash returns.' };
      return { label: 'ELEVATED', tone: 'bearish', text: spread + 'Most investors defaulting to 30-year or cash offers at these levels.' };
    },
  },
  DFF: {
    what: 'The rate banks charge each other for overnight loans — set by the Federal Reserve. This is the lever the Fed pulls to control the economy.',
    whyItMatters: 'Mortgage rates don\'t move in lockstep with this, but the direction tells you where rates are headed. When the Fed cuts, mortgage rates typically follow within weeks.',
    getSignal: (value, change) => {
      if (change < -0.1) return { label: 'FED IS CUTTING', tone: 'bullish', text: `The Fed just cut rates. Mortgage rates should follow. This is historically one of the strongest buy signals in real estate — rates drop, demand surges, prices follow.` };
      if (change === 0 && value < 4.5) return { label: 'ACCOMMODATIVE', tone: 'bullish', text: `Fed holding at ${value}% — relatively accommodative. Supports continued mortgage rate stability or decline.` };
      if (change === 0 && value >= 4.5) return { label: 'HOLDING PATTERN', tone: 'neutral', text: `Fed steady at ${value}%. Markets are pricing in the next move. Watch CPI and jobs data for clues on whether the next move is a cut or hold.` };
      if (change > 0) return { label: 'FED IS HIKING', tone: 'bearish', text: `The Fed raised rates. Expect mortgage rates to climb and buyer demand to cool. Acquisition opportunity is improving but exit timelines will stretch.` };
      return { label: 'STABLE', tone: 'neutral', text: `Fed funds at ${value}%. No major shift expected in the near term.` };
    },
  },
  MSPUS: {
    what: 'The median price of all existing homes sold in the US — half sold for more, half for less.',
    whyItMatters: 'This is the headline number that tells you if the overall market is appreciating or correcting. For flippers: rising prices = tailwind, falling prices = tighter margins.',
    getSignal: (value, change) => {
      if (change > 10) return { label: 'PRICES ACCELERATING', tone: 'bullish', text: `Median up $${change.toFixed(0)}K. Strong appreciation supports flip margins but increases acquisition costs. Comps are moving fast — run fresh numbers before every offer.` };
      if (change > 0) return { label: 'STEADY GROWTH', tone: 'neutral', text: `Up $${change.toFixed(0)}K — healthy appreciation. Predictable market for both flips and holds. Watch for overheating if this accelerates.` };
      if (change > -5) return { label: 'FLATTENING', tone: 'neutral', text: `Prices essentially flat. Market is finding equilibrium. Tighter margins on flips — be conservative on ARV estimates.` };
      return { label: 'PRICES DECLINING', tone: 'bearish', text: `Down $${Math.abs(change).toFixed(0)}K. Correction in progress. For flippers: add extra margin of safety to ARV. For buy-and-hold: potential entry point if fundamentals support it.` };
    },
  },
  CSUSHPINSA: {
    what: 'The gold standard for tracking home price changes over time. Measures repeat sales of the same properties to strip out mix effects.',
    whyItMatters: 'More reliable than median price for spotting real appreciation trends. If Case-Shiller is rising but median is flat, the mix is shifting (more low-end sales). If both are rising, the whole market is moving.',
    getSignal: (value, change) => {
      if (change > 1.5) return { label: 'STRONG APPRECIATION', tone: 'bullish', text: `Index up ${change.toFixed(2)} points — broad-based price gains across markets. Tailwind for flips and equity growth on holds.` };
      if (change > 0) return { label: 'MODERATE GROWTH', tone: 'neutral', text: `Steady at +${change.toFixed(2)}. Healthy market without overheating signals.` };
      return { label: 'PRICE PRESSURE', tone: 'bearish', text: `Index slipping — real prices are softening when you account for mix. Tighten your underwriting.` };
    },
  },
  HOUST: {
    what: 'The number of new residential construction projects started each month (in thousands).',
    whyItMatters: 'New construction is future supply. High starts today = more inventory in 6-12 months. For wholesalers: new construction areas often mean motivated existing-home sellers competing with builders.',
    getSignal: (value, change) => {
      if (value > 1300) return { label: 'SUPPLY INCOMING', tone: 'neutral', text: `${value}K starts — significant pipeline. Builders are confident but this supply will hit in 6-12 months. Watch for builder concessions that pressure resale comps.` };
      if (value > 1100) return { label: 'MODERATE BUILD', tone: 'neutral', text: `${value}K starts — healthy pace. Supply pipeline is steady but not flooding. Balanced market ahead.` };
      return { label: 'CONSTRUCTION SLOWDOWN', tone: 'bearish', text: `Only ${value}K starts — builders pulling back. Less future supply = tighter inventory later. Could support prices 6-12 months out but signals near-term economic concern.` };
    },
  },
  PERMIT: {
    what: 'The number of building permits issued for new construction. Permits come before starts — this is the earliest leading indicator of future supply.',
    whyItMatters: 'Permits are a 6-18 month look-ahead. A surge in permits today means competition from new builds coming to market later. A drop means supply will tighten further.',
    getSignal: (value, change) => {
      if (change > 50) return { label: 'SURGE IN PERMITS', tone: 'neutral', text: `Up ${change}K — builders are bullish. Expect more supply hitting markets in 2026-2027. This can create pockets of oversupply in high-build metros.` };
      if (change > 0) return { label: 'PERMITS RISING', tone: 'neutral', text: `+${change}K permits. Builders adding capacity. Normal expansion — not yet at oversupply risk.` };
      return { label: 'PERMITS FALLING', tone: 'bearish', text: `Down ${Math.abs(change)}K. Builders losing confidence. Future supply will tighten — could support prices but signals economic caution.` };
    },
  },
  MSACSR: {
    what: 'How many months it would take to sell all current inventory at the current pace. Under 4 = seller\'s market. 4-6 = balanced. Over 6 = buyer\'s market.',
    whyItMatters: 'This is the most important supply metric for your negotiating position. Low supply = sellers have leverage. High supply = buyers (you) have leverage. It directly affects how aggressive you can be on offers.',
    getSignal: (value, change) => {
      if (value < 3) return { label: 'EXTREME SELLER\'S MARKET', tone: 'bearish', text: `${value} months — painfully tight. Very hard to acquire at discount. Sellers know they have leverage. Focus on distressed/motivated sellers only.` };
      if (value < 4) return { label: 'SELLER\'S MARKET', tone: 'neutral', text: `${value} months — still tilted toward sellers but workable. Off-market approach is your edge here. Retail offers get outbid.` };
      if (value < 6) return { label: 'BALANCED MARKET', tone: 'bullish', text: `${value} months — sweet spot for acquisitions. Enough supply for sellers to feel pressure, but not so much that exit values crater. Good hunting ground.` };
      return { label: 'BUYER\'S MARKET', tone: 'bullish', text: `${value} months — buyers control the table. Sellers are anxious. Widen your net and negotiate harder — time is on your side.` };
    },
  },
  UNRATE: {
    what: 'The percentage of people actively looking for work who can\'t find it.',
    whyItMatters: 'Rising unemployment = more distressed sellers (job loss, can\'t make payments). But also = fewer qualified buyers for your exits. It\'s a double-edged sword.',
    getSignal: (value, change) => {
      if (value > 5.0) return { label: 'ELEVATED DISTRESS', tone: 'bearish', text: `${value}% unemployment signals economic pain. Expect more motivated sellers but a smaller buyer pool. Wholesale and assign quickly — don't hold risk.` };
      if (value > 4.5) return { label: 'SOFTENING', tone: 'neutral', text: `${value}% — labor market cooling. Pre-foreclosure and financial distress leads will increase. Good pipeline builder if you have the marketing in place.` };
      if (value > 3.5) return { label: 'HEALTHY', tone: 'bullish', text: `${value}% — strong employment supports housing demand. Buyers can qualify for loans, sellers don't have to fire-sale. Stable market for both flips and holds.` };
      return { label: 'VERY TIGHT', tone: 'bullish', text: `${value}% — extremely strong labor market. Almost everyone who wants work has it. Strong buyer demand but fewer distressed sellers. Compete on speed and relationships.` };
    },
  },
  CPIAUCSL: {
    what: 'Measures how fast prices are rising across the economy — food, gas, housing, everything. The Fed\'s enemy #1.',
    whyItMatters: 'CPI drives Fed rate decisions, which drive mortgage rates, which drive your whole market. Rising CPI = the Fed holds or hikes = rates stay high = buyer demand stays compressed.',
    getSignal: (value, change) => {
      if (change > 0.5) return { label: 'INFLATION HOT', tone: 'bearish', text: `CPI up ${change.toFixed(2)} — inflation running above target. The Fed will NOT cut rates while this persists. Expect mortgage rates to hold or rise. Plan for a higher-rate environment.` };
      if (change > 0.2) return { label: 'MODERATE INFLATION', tone: 'neutral', text: `+${change.toFixed(2)} — inflation close to target (~3% annualized). The Fed has room to cut if employment weakens. Rates could drift lower.` };
      if (change > 0) return { label: 'INFLATION COOLING', tone: 'bullish', text: `Only +${change.toFixed(2)} — inflation is decelerating. This is what the Fed wants to see before cutting. Rate cuts become more likely, which is bullish for real estate.` };
      return { label: 'DEFLATION RISK', tone: 'bullish', text: `CPI flat or declining — very unusual. The Fed will likely cut aggressively. Expect a wave of demand when rates respond. Position for the upswing.` };
    },
  },
};

// Category-level insight generator
const getCategoryInsight = (category, seriesData) => {
  const getData = (id) => {
    const s = seriesData.find((d) => d.series === id);
    return s?.data?.[0] || null;
  };

  switch (category) {
    case 'rates': {
      const m30 = getData('MORTGAGE30US');
      const fed = getData('DFF');
      if (fed?.change < 0) {
        return 'The Fed just cut rates — mortgage rates should follow. Historically, the 6-12 months after a rate cut are the strongest period for real estate demand. Position now before the herd catches up.';
      }
      if (m30 && m30.value < 6.5) {
        return 'Rates below 6.5% are expanding the buyer pool significantly. More qualified buyers means faster exits on flips and stronger comps. Acquisition competition will intensify.';
      }
      if (m30 && m30.value >= 7.0) {
        return 'Elevated rates are keeping buyers on the sidelines. This creates negotiating leverage on acquisitions, but plan for longer hold times and smaller buyer pools on exits.';
      }
      return 'Rates are in a middle ground — workable for both acquisitions and exits. Watch the Fed for direction. The next 25bps move will signal the trend for the rest of the year.';
    }
    case 'pricing': {
      const median = getData('MSPUS');
      const cs = getData('CSUSHPINSA');
      if (median?.change > 10 && cs?.change > 1) {
        return 'Both median prices and the Case-Shiller index are climbing — this is real, broad-based appreciation, not just a shift in what\'s selling. Flip margins have a tailwind, but don\'t chase — the best deals are still off-market.';
      }
      if (median?.change < 0) {
        return 'Prices are pulling back. For flippers, add 5-10% extra margin of safety to your ARV estimates. For buy-and-hold investors, this could be a rare entry point if fundamentals (jobs, supply) support recovery.';
      }
      return 'Prices are growing at a sustainable pace. Healthy for long-term holds. For flips, run comps within the last 60 days — anything older may overstate your ARV.';
    }
    case 'supply': {
      const supply = getData('MSACSR');
      const permits = getData('PERMIT');
      if (supply && supply.value > 5) {
        return 'Supply is building — more negotiating leverage for buyers. Combined with rising permits, expect even more inventory ahead. This is the window to lock in acquisitions before prices adjust downward.';
      }
      if (supply && supply.value < 3.5) {
        return 'Inventory is still painfully tight. Off-market sourcing isn\'t just an advantage here — it\'s a necessity. On-market deals will have multiple offers. Focus on direct-to-seller channels.';
      }
      if (supply?.change > 0 && permits?.change > 0) {
        return 'Both existing supply and new permits are rising. The market is slowly shifting toward buyers. Patience on acquisitions will be rewarded — don\'t overpay just because you found a deal.';
      }
      return 'Supply metrics are mixed. The market isn\'t tipping clearly in either direction. Stay disciplined on your numbers and don\'t stretch on acquisition price.';
    }
    case 'macro': {
      const unemp = getData('UNRATE');
      const cpi = getData('CPIAUCSL');
      if (unemp?.value > 4.5 && cpi?.change < 0.3) {
        return 'Jobs are softening while inflation cools — this is the setup for Fed rate cuts. If both trends continue, expect a meaningful drop in mortgage rates within 2-3 months. Strong tailwind ahead.';
      }
      if (unemp?.value < 4.0 && cpi?.change > 0.4) {
        return 'Hot labor market + persistent inflation = the Fed stays hawkish. Don\'t bank on rate relief anytime soon. Underwrite deals assuming rates hold at current levels for at least 6 months.';
      }
      if (unemp?.change > 0) {
        return 'Unemployment ticking up. Watch this closely — it\'s a leading indicator for distressed seller volume. If you run direct mail or cold call campaigns, this is the time to scale up.';
      }
      return 'Macro conditions are stable. No major catalyst for rate changes in either direction. Focus on deal-level fundamentals rather than waiting for macro tailwinds.';
    }
    default:
      return null;
  }
};

export default function MarketPage() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const res = await fetch('/api/market-data');
        const json = await res.json();
        if (json.success) {
          setMarketData(json.data);
        } else {
          setError(json.error || 'Failed to fetch market data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMarketData();
  }, []);

  const getLatestValue = (series) => {
    if (!series.data || series.data.length === 0) return null;
    return series.data[0];
  };

  const formatValue = (value, unit) => {
    if (value === null || value === undefined) return 'N/A';
    if (unit === 'percent') return `${value.toFixed(2)}%`;
    if (unit === 'thousands of dollars') return `$${value.toFixed(0)}K`;
    if (unit === 'thousands of units') return `${value.toFixed(0)}K`;
    if (unit === 'months') return `${value.toFixed(1)}mo`;
    return value.toFixed(2);
  };

  const getChangeColor = (change, series) => {
    if (!change && change !== 0) return 'var(--text-muted)';

    // Series where DOWN is favorable (green):
    // - Mortgage rates (lower = cheaper borrowing)
    // - Unemployment rate (lower = stronger economy)
    // - Fed funds rate (lower = looser monetary policy)
    const downIsGood = [
      'MORTGAGE30US', 'MORTGAGE15US', 'DFF', 'UNRATE',
    ];

    const isUp = change > 0;
    const seriesId = series?.series || '';

    if (downIsGood.includes(seriesId)) {
      return isUp ? 'var(--red)' : 'var(--green)';
    }

    // For everything else (prices, supply, permits, etc.), up is good
    return isUp ? 'var(--green)' : 'var(--red)';
  };

  const getChangeArrow = (change) => {
    if (!change && change !== 0) return '•';
    return change > 0 ? '▲' : '▼';
  };

  const getSparklineMetrics = (data) => {
    if (!data || data.length < 2) {
      return { min: 0, max: 1, range: 1 };
    }
    const values = data.map((d) => d.value).filter((v) => v !== null);
    if (values.length === 0) {
      return { min: 0, max: 1, range: 1 };
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min === 0 ? 1 : max - min;
    return { min, max, range };
  };

  const getBarHeight = (value, metrics) => {
    if (value === null || value === undefined) return 0;
    const normalized = (value - metrics.min) / metrics.range;
    return Math.max(10, normalized * 100);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.sectionTag}>
            <div className={styles.bar} />
            <span>Market Intelligence</span>
          </div>
          <h1 className={styles.title}>What The Data Says Today</h1>
          <p className={styles.subtitle}>Real-time economic indicators at a glance</p>
        </header>

        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.skeleton}`}>
              <div className={styles.skeletonHeader} />
              <div className={styles.skeletonValue} />
              <div className={styles.skeletonMeta} />
              <div className={styles.skeletonSparkline} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.sectionTag}>
            <div className={styles.bar} />
            <span>Market Intelligence</span>
          </div>
          <h1 className={styles.title}>Error Loading Data</h1>
        </header>
        <div className={styles.errorState}>
          <p>Unable to load market data: {error}</p>
        </div>
      </div>
    );
  }

  if (marketData.length === 0) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.sectionTag}>
            <div className={styles.bar} />
            <span>Market Intelligence</span>
          </div>
          <h1 className={styles.title}>What The Data Says Today</h1>
          <p className={styles.subtitle}>Real-time economic indicators at a glance</p>
        </header>
        <div className={styles.emptyState}>
          <p>No market data available yet.</p>
          <p className={styles.emptyHint}>Run the FRED API script to populate market metrics.</p>
        </div>
      </div>
    );
  }

  // Group by category
  const categoryLabels = {
    rates: 'Interest Rates',
    pricing: 'Home Prices',
    supply: 'Supply & Construction',
    macro: 'Macro Economy',
  };

  const categoryOrder = ['rates', 'pricing', 'supply', 'macro'];

  const grouped = {};
  marketData.forEach((series) => {
    const cat = series.category || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(series);
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.sectionTag}>
          <div className={styles.bar} />
          <span>Market Intelligence</span>
        </div>
        <h1 className={styles.title}>What The Data Says Today</h1>
        <p className={styles.subtitle}>
          Live economic indicators from FRED, updated automatically. The numbers that move real estate.
        </p>
      </header>

      {categoryOrder.map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        const catInsight = getCategoryInsight(cat, marketData);

        return (
          <div key={cat} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{categoryLabels[cat] || cat}</h2>
            {catInsight && (
              <div className={styles.categoryInsight}>
                <span className={styles.insightIcon}>◆</span>
                <p>{catInsight}</p>
              </div>
            )}
            <div className={styles.grid}>
              {items.map((series) => {
          const latest = getLatestValue(series);
          const sparklineMetrics = getSparklineMetrics(series.data);
          const recentData = series.data ? series.data.slice(0, 6) : [];
          const context = SERIES_CONTEXT[series.series];
          const signal = context?.getSignal && latest
            ? context.getSignal(latest.value, latest.change)
            : null;

          return (
            <div key={series.id} className={styles.card}>
              <div className={styles.cardInner}>
                <HUDCorners />

                <div className={styles.cardHeader}>
                  <div className={styles.titleGroup}>
                    <h3 className={styles.cardTitle}>{series.title}</h3>
                  </div>
                  {series.frequency && (
                    <span className={styles.frequencyBadge}>{series.frequency}</span>
                  )}
                </div>

                <div className={styles.valueSection}>
                  <p className={styles.value}>
                    {latest ? formatValue(latest.value, series.unit) : 'N/A'}
                  </p>

                  {latest && latest.change !== null && latest.change !== undefined && (
                    <p
                      className={styles.change}
                      style={{ color: getChangeColor(latest.change, series) }}
                    >
                      <span className={styles.arrow}>{getChangeArrow(latest.change)}</span>
                      {Math.abs(latest.change).toFixed(2)}
                    </p>
                  )}
                </div>

                {signal && (
                  <div className={`${styles.signalBadge} ${styles[`signal_${signal.tone}`]}`}>
                    {signal.label}
                  </div>
                )}

                <p className={styles.unit}>{series.unit}</p>

                {latest && (
                  <p className={styles.lastUpdate}>
                    Updated {new Date(latest.date || series.lastUpdate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}

                {signal && (
                  <div className={styles.signalText}>
                    <p>{signal.text}</p>
                  </div>
                )}

                {context?.whyItMatters && (
                  <div className={styles.contextText}>
                    <span className={styles.contextLabel}>Why this matters:</span>
                    <p>{context.whyItMatters}</p>
                  </div>
                )}

                {recentData.length > 1 && (
                  <div className={styles.sparklineContainer}>
                    <div className={styles.sparkline}>
                      {recentData.map((point, idx) => (
                        <div
                          key={idx}
                          className={styles.bar}
                          style={{
                            height: `${getBarHeight(point.value, sparklineMetrics)}%`,
                          }}
                          title={`${point.date}: ${point.value}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
