'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';
import styles from './bootscreen.module.css';

export default function BootScreen({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // Check if we've already shown boot screen in this session
    const hasShownBoot = sessionStorage.getItem('omd-boot-shown');

    if (!hasShownBoot) {
      setIsVisible(true);
      sessionStorage.setItem('omd-boot-shown', 'true');

      // Trigger fade-out after 1.2 seconds
      const timer = setTimeout(() => {
        setIsHiding(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) {
    return children;
  }

  return (
    <>
      <div className={`${styles.bootScreen} ${isHiding ? styles.hiding : ''}`}>
        <div className={styles.bootContent}>
          <Logo size={80} />
          <div className={styles.bootText}>Loading Market Intelligence...</div>
          <div className={styles.bootProgressBar}>
            <div className={styles.bootProgressFill} />
          </div>
        </div>
      </div>
      {isHiding && children}
    </>
  );
}
