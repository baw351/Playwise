import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GameCard.module.css';

function GameCard({ game }) {
  return (
    <Link to={`/games/${game.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <img
            src={game.background_image || '/placeholder.svg'}
            alt={game.name}
            className={styles.image}
            loading="lazy"
          />
          <div className={styles.gradientOverlay}>
            <div className={styles.badges}>
              <span className={styles.rating}>
                {game.ratings_count} évaluations
              </span>
              {game.metacritic && (
                <span
                  className={`${styles.metacritic} ${
                    game.metacritic > 74
                      ? styles.green
                      : game.metacritic > 49
                      ? styles.yellow
                      : styles.red
                  }`}
                >
                  {game.metacritic}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.title}>{game.name}</h3>
          <div className={styles.genres}>
            {game.genres?.slice(0, 3).map((genre) => (
              <span key={genre.id} className={styles.genre}>
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default GameCard;
