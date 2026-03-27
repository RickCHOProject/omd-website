'use client';

import { useEffect, useState } from 'react';
import HUDCorners from '../components/HUDCorners';
import styles from './predictions.module.css';

export default function PredictionTracker() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    fetchPredictions();
  }, [filter]);

  async function fetchPredictions() {
    try {
      setLoading(true);
      const resolved = filter === 'resolved' ? 'true' : filter === 'active' ? 'false' : null;
      let url = '/api/predictions';
      if (resolved !== null) {
        url += `?resolved=${resolved}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setPredictions(json.data);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#00D68F';
    if (confidence >= 0.6) return '#D4A853';
    if (confidence >= 0.4) return '#FFB020';
    return '#FF4D4D';
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'Correct':
        return '#00D68F';
      case 'Incorrect':
        return '#FF4D4D';
      case 'Partial':
        return '#FFB020';
      case 'Too Early':
        return '#5B8DEF';
      default:
        return '#4A6B5C';
    }
  };

  const getDaysUntilExpiry = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Prediction Tracker</h1>
        <p className={styles.loading}>Loading predictions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1>Prediction Tracker</h1>
        <p className={styles.error}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Prediction Tracker</h1>
        <p className={styles.subtitle}>AI-powered market predictions with accountability</p>
      </header>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'active' ? styles.active : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({predictions.filter((p) => !p.resolved).length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'resolved' ? styles.active : ''}`}
          onClick={() => setFilter('resolved')}
        >
          Resolved ({predictions.filter((p) => p.resolved).length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({predictions.length})
        </button>
      </div>

      <div className={styles.list}>
        {predictions.length === 0 ? (
          <div className={styles.empty}>
            <p>No predictions in this category</p>
          </div>
        ) : (
          predictions.map((pred) => (
            <div key={pred.id} className={styles.predictionCard}>
              <HUDCorners />
              <div className={styles.cardTop}>
                <div className={styles.titleSection}>
                  <h3 className={styles.title}>{pred.title}</h3>
                  {pred.resolved && (
                    <span
                      className={styles.verdict}
                      style={{ backgroundColor: getVerdictColor(pred.verdict) }}
                    >
                      {pred.verdict}
                    </span>
                  )}
                </div>

                <div className={styles.confidence}>
                  <div
                    className={styles.confidenceMeter}
                    style={{ width: `${pred.confidence * 100}%`, backgroundColor: getConfidenceColor(pred.confidence) }}
                  />
                  <span className={styles.confidenceLabel}>{(pred.confidence * 100).toFixed(0)}% confidence</span>
                </div>
              </div>

              <p className={styles.description}>{pred.description}</p>

              <div className={styles.details}>
                <div className={styles.detail}>
                  <span className={styles.label}>Prediction:</span>
                  <span className={styles.value}>{pred.prediction}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Timeframe:</span>
                  <span className={styles.value}>{pred.timeframe}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Market Segment:</span>
                  <span className={styles.value}>{pred.marketSegment}</span>
                </div>
              </div>

              {pred.rationale && (
                <div className={styles.rationale}>
                  <strong>Rationale:</strong>
                  <p>{pred.rationale}</p>
                </div>
              )}

              <div className={styles.footer}>
                {!pred.resolved && (
                  <div className={styles.expiryStatus}>
                    <span>Expires in {getDaysUntilExpiry(pred.expiresAt)} days</span>
                  </div>
                )}

                {pred.resolved && (
                  <div className={styles.accuracy}>
                    <span>
                      {pred.accuracy === 1 && '✓ Accurate'}
                      {pred.accuracy === 0.5 && '◐ Partial'}
                      {pred.accuracy === 0 && '✗ Inaccurate'}
                    </span>
                  </div>
                )}

                <p className={styles.timestamp}>
                  {new Date(pred.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
