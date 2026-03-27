'use client';

import { useEffect, useState } from 'react';
import HUDCorners from '../components/HUDCorners';
import styles from './market.module.css';

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

        return (
          <div key={cat} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{categoryLabels[cat] || cat}</h2>
            <div className={styles.grid}>
              {items.map((series) => {
          const latest = getLatestValue(series);
          const sparklineMetrics = getSparklineMetrics(series.data);
          const recentData = series.data ? series.data.slice(0, 6) : [];

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

                <p className={styles.unit}>{series.unit}</p>

                {latest && (
                  <p className={styles.lastUpdate}>
                    Updated {new Date(latest.date || series.lastUpdate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
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
