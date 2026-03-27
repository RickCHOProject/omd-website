/**
 * Verdict Pill Component
 * Reusable verdict badge for claims/predictions
 * Gemini design: colored borders with subtle background
 */

import styles from './verdictpill.module.css';

export default function VerdictPill({ type = 'SUPPORTED' }) {
  const getTypeClass = () => {
    switch (type.toUpperCase()) {
      case 'SUPPORTED':
        return styles.supported;
      case 'CONTRADICTED':
        return styles.contradicted;
      case 'MIXED':
        return styles.mixed;
      case 'INSUFFICIENT':
        return styles.insufficient;
      default:
        return styles.supported;
    }
  };

  return (
    <div className={`${styles.verdictPill} ${getTypeClass()}`}>
      {type.toUpperCase()}
    </div>
  );
}
