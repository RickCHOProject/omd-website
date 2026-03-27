'use client';

import { useEffect, useState } from 'react';
import HUDCorners from '../components/HUDCorners';
import styles from './feed.module.css';

export default function ContentFeed() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnalyses();
  }, [filter]);

  async function fetchAnalyses() {
    try {
      setLoading(true);
      let url = '/api/content-feed?limit=50';
      if (filter !== 'all') {
        url += `&verdict=${filter}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setAnalyses(json.data);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'Supported':
        return '#00D68F';
      case 'Contradicted':
        return '#FF4D4D';
      case 'Mixed':
        return '#FFB020';
      case 'Insufficient Data':
        return '#5B8DEF';
      default:
        return '#4A6B5C';
    }
  };

  const getVerdictBg = (verdict) => {
    switch (verdict) {
      case 'Supported':
        return 'rgba(0,214,143,0.1)';
      case 'Contradicted':
        return 'rgba(255,77,77,0.1)';
      case 'Mixed':
        return 'rgba(255,176,32,0.1)';
      case 'Insufficient Data':
        return 'rgba(91,141,239,0.1)';
      default:
        return 'rgba(74,107,92,0.1)';
    }
  };

  const ClaimList = ({ claims, type }) => {
    if (!claims || claims.length === 0) return null;

    const colors = {
      supported: '#00D68F',
      contradicted: '#FF4D4D',
      insufficient: '#5B8DEF',
    };

    let symbol = '';
    let color = colors.insufficient;

    if (type === 'supported') {
      symbol = '✓';
      color = colors.supported;
    } else if (type === 'contradicted') {
      symbol = '✗';
      color = colors.contradicted;
    }

    return (
      <div className={styles.claimSection}>
        <strong style={{ color }}>
          {symbol} {type === 'supported' ? 'Supported' : type === 'contradicted' ? 'Contradicted' : 'Insufficient Data'}
        </strong>
        <ul className={styles.claimList}>
          {claims.map((claim, idx) => (
            <li key={idx}>{claim}</li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Content Analysis Feed</h1>
        <p className={styles.loading}>Loading analyses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1>Content Analysis Feed</h1>
        <p className={styles.error}>Error: {error}</p>
      </div>
    );
  }

  const verdictCounts = {
    'Supported': analyses.filter((a) => a.verdict === 'Supported').length,
    'Contradicted': analyses.filter((a) => a.verdict === 'Contradicted').length,
    'Mixed': analyses.filter((a) => a.verdict === 'Mixed').length,
    'Insufficient Data': analyses.filter((a) => a.verdict === 'Insufficient Data').length,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Daily Content Analysis Feed</h1>
        <p className={styles.subtitle}>AI pressure-tests creator claims against market data</p>
      </header>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({analyses.length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'Supported' ? styles.active : ''}`}
          onClick={() => setFilter('Supported')}
        >
          Supported ({verdictCounts['Supported']})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'Mixed' ? styles.active : ''}`}
          onClick={() => setFilter('Mixed')}
        >
          Mixed ({verdictCounts['Mixed']})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'Contradicted' ? styles.active : ''}`}
          onClick={() => setFilter('Contradicted')}
        >
          Contradicted ({verdictCounts['Contradicted']})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'Insufficient Data' ? styles.active : ''}`}
          onClick={() => setFilter('Insufficient Data')}
        >
          Insufficient ({verdictCounts['Insufficient Data']})
        </button>
      </div>

      <div className={styles.feed}>
        {analyses.length === 0 ? (
          <div className={styles.empty}>
            <p>No analyses found for this filter</p>
          </div>
        ) : (
          analyses.map((analysis) => (
            <div key={analysis.id} className={styles.analysisCard}>
              <HUDCorners />
              <div className={styles.cardHeader}>
                <div className={styles.creatorInfo}>
                  <h3 className={styles.creatorName}>{analysis.creatorName}</h3>
                  <p className={styles.timestamp}>
                    {new Date(analysis.analyzedAt).toLocaleDateString()} at{' '}
                    {new Date(analysis.analyzedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <span
                  className={styles.verdict}
                  style={{
                    backgroundColor: getVerdictBg(analysis.verdict),
                    color: getVerdictColor(analysis.verdict),
                  }}
                >
                  {analysis.verdict}
                </span>
              </div>

              <h4 className={styles.analysisTitle}>{analysis.title}</h4>

              {analysis.claimText && <p className={styles.claim}>{analysis.claimText}</p>}

              <div className={styles.analysis}>
                {analysis.verdictReason && (
                  <div className={styles.reason}>
                    <strong>Analysis:</strong> {analysis.verdictReason}
                  </div>
                )}

                {(analysis.supportedClaims?.length > 0 ||
                  analysis.contradictedClaims?.length > 0 ||
                  analysis.insufficientDataClaims?.length > 0) && (
                  <div className={styles.claims}>
                    <ClaimList claims={analysis.supportedClaims} type="supported" />
                    <ClaimList claims={analysis.contradictedClaims} type="contradicted" />
                    <ClaimList claims={analysis.insufficientDataClaims} type="insufficient" />
                  </div>
                )}

                {analysis.marketDataUsed && analysis.marketDataUsed.length > 0 && (
                  <div className={styles.dataUsed}>
                    <strong>Market Data:</strong>
                    <div className={styles.dataList}>
                      {analysis.marketDataUsed.map((data, idx) => (
                        <span key={idx} className={styles.dataTag}>
                          {data}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.footer}>
                <div className={styles.confidence}>
                  <span>Confidence: {(analysis.confidenceScore * 100).toFixed(0)}%</span>
                </div>

                {analysis.fearMongeringScore !== null && (
                  <div className={styles.fearMongering}>
                    {analysis.fearMongeringScore > 0.6 && <span>⚠ Fear-mongering detected</span>}
                    {analysis.fearMongeringScore <= 0.6 && (
                      <span>Fear-mongering index: {(analysis.fearMongeringScore * 100).toFixed(0)}%</span>
                    )}
                  </div>
                )}

                {analysis.contentUrl && (
                  <a href={analysis.contentUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    View Original
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
