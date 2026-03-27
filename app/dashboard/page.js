'use client';

import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';

export default function MarketDashboard() {
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
          setError(json.error);
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
    if (value === null) return 'N/A';
    if (unit === 'percent') return `${value.toFixed(2)}%`;
    if (unit === 'thousands of dollars') return `$${value.toFixed(1)}K`;
    if (unit === 'thousands of units') return `${value.toFixed(0)}K`;
    if (unit === 'months') return `${value.toFixed(1)} months`;
    return value.toFixed(2);
  };

  const getChangeColor = (change) => {
    if (!change) return '#999';
    return change > 0 ? '#00b894' : '#e74c3c';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Market Intelligence Dashboard</h1>
        <p className={styles.loading}>Loading market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1>Market Intelligence Dashboard</h1>
        <p className={styles.error}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Market Intelligence Dashboard</h1>
        <p className={styles.subtitle}>Real-time economic indicators and market data</p>
      </header>

      <div className={styles.grid}>
        {marketData.map((series) => {
          const latest = getLatestValue(series);
          return (
            <div key={series.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{series.title}</h3>
                <span className={styles.frequency}>{series.frequency}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.valueDisplay}>
                  <p className={styles.value}>{formatValue(latest?.value, series.unit)}</p>
                  {latest?.change !== null && latest?.change !== undefined && (
                    <p
                      className={styles.change}
                      style={{ color: getChangeColor(latest.change) }}
                    >
                      {latest.change > 0 ? '▲' : '▼'} {Math.abs(latest.change).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className={styles.unit}>{series.unit}</div>

                <div className={styles.metadata}>
                  <p>
                    <strong>Latest:</strong> {latest?.date}
                  </p>
                  <p>
                    <strong>Updated:</strong> {new Date(series.lastUpdate).toLocaleDateString()}
                  </p>
                </div>

                {series.data && series.data.length > 1 && (
                  <div className={styles.trend}>
                    <div className={styles.sparkline}>
                      {series.data.slice(0, 6).map((point, idx) => (
                        <span
                          key={idx}
                          className={styles.sparklineBar}
                          style={{
                            height: `${((point.value - Math.min(...series.data.map(d => d.value))) /
                              (Math.max(...series.data.map(d => d.value)) -
                                Math.min(...series.data.map(d => d.value)))) *
                              100}%`,
                          }}
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

      {marketData.length === 0 && (
        <div className={styles.empty}>
          <p>No market data available. Run the FRED API script to populate data.</p>
        </div>
      )}
    </div>
  );
}
