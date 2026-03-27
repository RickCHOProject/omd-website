/**
 * HUD Corners Component
 * Tactical gold corner accents - adds visual polish to cards
 * Gemini design element: reusable corner borders
 */

import styles from './hudcorners.module.css';

export default function HUDCorners() {
  return (
    <>
      <div className={styles.cornerTopLeft} />
      <div className={styles.cornerTopRight} />
      <div className={styles.cornerBottomLeft} />
      <div className={styles.cornerBottomRight} />
    </>
  );
}
