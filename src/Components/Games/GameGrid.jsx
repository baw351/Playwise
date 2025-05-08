import React from 'react';
import GameCard from './GameCard';
import styles from './GameGrid.module.css';

function GameGrid({ games, loading = false }) {
  const skeletonItems = Array(6).fill(0).map((_, i) => i);

  return (
    <div className={styles.grid}>
      {loading
        ? skeletonItems.map((i) => (
            <div key={i} className={styles.skeletonWrapper}>
              <div className={styles.skeletonAspect} />
              <div className={styles.skeletonLineShort} />
              <div className={styles.skeletonLineTiny} />
            </div>
          ))
        : games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
    </div>
  );
}

export default GameGrid;
