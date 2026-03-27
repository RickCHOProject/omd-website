'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './creators.module.css';

export default function CreatorProfiles() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('credibilityScore');

  useEffect(() => {
    fetchCreators();
  }, [sortBy]);

  async function fetchCreators() {
    try {
      setLoading(true);
      const res = await fetch(`/api/creators?sortBy=${sortBy}`);
      const json = await res.json();
      if (json.success) {
        setCreators(json.data);
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
      case 'Highly Reliable':
        return '#27ae60';
      case 'Mostly Reliable':
        return '#00b894';
      case 'Mixed Reliability':
        return '#f39c12';
      case 'Low Reliability':
        return '#e74c3c';
      default:
        return '#999';
    }
  };

  const getVerdictBg = (verdict) => {
    switch (verdict) {
      case 'Highly Reliable':
        return '#d5f4e6';
      case 'Mostly Reliable':
        return '#d5f4e6';
      case 'Mixed Reliability':
        return '#fdebd0';
      case 'Low Reliability':
        return '#fadbd8';
      default:
        return '#f0f0f0';
    }
  };

  const ScoreBar = ({ score, label }) => (
    <div className={styles.scoreBar}>
      <div className={styles.scoreLabel}>{label}</div>
      <div className={styles.barContainer}>
        <div
          className={styles.barFill}
          style={{
            width: `${score * 100}%`,
            backgroundColor: score >= 0.7 ? '#00b894' : score >= 0.5 ? '#f39c12' : '#e74c3c',
          }}
        />
      </div>
      <div className={styles.scoreValue}>{(score * 100).toFixed(0)}%</div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Creator Credibility Profiles</h1>
        <p className={styles.loading}>Loading creators...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1>Creator Credibility Profiles</h1>
        <p className={styles.error}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Creator Credibility Profiles</h1>
        <p className={styles.subtitle}>Track accuracy, consistency, and reliability of market content creators</p>
      </header>

      <div className={styles.sortSection}>
        <label htmlFor="sort">Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="credibilityScore">Credibility Score (High to Low)</option>
          <option value="followers">Followers (High to Low)</option>
          <option value="fearMongeringIndex">Fear Mongering Index (Low to High)</option>
        </select>
      </div>

      <div className={styles.grid}>
        {creators.length === 0 ? (
          <div className={styles.empty}>
            <p>No creators available</p>
          </div>
        ) : (
          creators.map((creator) => (
            <div key={creator.id} className={styles.creatorCard}>
              <div className={styles.cardHeader}>
                <div className={styles.headerTop}>
                  <div>
                    <h3 className={styles.name}>{creator.name}</h3>
                    <p className={styles.handle}>
                      @{creator.handle} · {creator.platform}
                    </p>
                  </div>
                  <a href={creator.profileUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    ↗
                  </a>
                </div>

                <span
                  className={styles.verdictBadge}
                  style={{
                    backgroundColor: getVerdictBg(creator.verdict),
                    color: getVerdictColor(creator.verdict),
                  }}
                >
                  {creator.verdict}
                </span>
              </div>

              {creator.bio && <p className={styles.bio}>{creator.bio}</p>}

              <div className={styles.mainScore}>
                <div className={styles.largeScore}>
                  <div className={styles.scoreNumber}>{(creator.credibilityScore * 100).toFixed(0)}</div>
                  <div className={styles.scoreLabel}>Credibility Score</div>
                </div>
              </div>

              <div className={styles.scoreGrid}>
                <ScoreBar score={creator.accuracy} label="Accuracy" />
                <ScoreBar score={creator.consistency} label="Consistency" />
                <ScoreBar score={creator.convictionCalibration} label="Conviction" />
                <ScoreBar score={creator.behavioralAuthenticity} label="Authenticity" />
              </div>

              <div className={styles.fearMongering}>
                <strong>Fear Mongering Index:</strong> {(creator.fearMongeringIndex * 100).toFixed(0)}%
                {creator.fearMongeringIndex > 0.5 && <span className={styles.warning}> ⚠ High</span>}
                {creator.fearMongeringIndex <= 0.5 && creator.fearMongeringIndex > 0.3 && (
                  <span className={styles.caution}> ⚡ Moderate</span>
                )}
                {creator.fearMongeringIndex <= 0.3 && <span className={styles.good}> ✓ Low</span>}
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.label}>Followers</span>
                  <span className={styles.value}>{(creator.followers / 1000).toFixed(0)}K</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Avg Views</span>
                  <span className={styles.value}>{(creator.averageViews / 1000).toFixed(0)}K</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.label}>Analyses</span>
                  <span className={styles.value}>{creator.recentAnalyses}</span>
                </div>
              </div>

              {creator.lastAnalyzedAt && (
                <p className={styles.lastUpdated}>
                  Last analyzed: {new Date(creator.lastAnalyzedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
