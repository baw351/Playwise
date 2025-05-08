import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>Améliore tes compétences de jeu</h1>
        <p className={styles.description}>
        Découvre des guides, stratégies et astuces créés par la communauté pour tes jeux préférés. Partage aussi ton expertise et aide les autres à surmonter tous les défis.
        </p>
        <div className={styles.buttons}>
          <Link to="/games" className={`${styles.button} ${styles.primary}`}>
            Explorer les jeux
          </Link>
          <Link to="/submit-tip" className={`${styles.button} ${styles.secondary}`}>
            Partager tes connaissances
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
