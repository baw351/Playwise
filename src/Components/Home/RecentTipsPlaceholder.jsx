import React from 'react';
import styles from './RecentTipsPlaceholder.module.css';

export default function RecentTipsPlaceholder() {
  const placeholders = Array.from({ length: 8 }); // 8 items as example

  return (
    <div className={styles.grid}>
      {placeholders.map((_, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.imageSkeleton} />
          <div className={styles.textSkeletonShort} />
          <div className={styles.textSkeletonLong} />
        </div>
      ))}
    </div>
  );
}
