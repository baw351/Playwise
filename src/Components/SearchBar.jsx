import { useState, useEffect } from 'react';
import { searchGames } from '../services/rawgAPI';
import styles from './SearchBar.module.css'; // Updated import to use the .module.css format

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        setLoading(true);
        setError(null);
        
        searchGames(query)
          .then(results => {
            setGames(results);
            setShowResults(true);
            setLoading(false);
          })
          .catch(err => {
            console.error(err);
            setError('Une erreur est survenue lors de la recherche.');
            setLoading(false);
          });
      } else {
        setGames([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(`.${styles.searchContainer}`)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => games.length > 0 && setShowResults(true)}
          placeholder="Rechercher un jeu..."
          className={styles.searchInput}
        />
        {loading && <div className={styles.loadingIndicator}>Chargement...</div>}
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {showResults && games.length > 0 && (
        <div className={styles.searchResults}>
          <div className={styles.resultsHeader}>Jeux</div>
          {games.map((game) => (
            <div key={game.id} className={styles.gameItem}>
              <div className={styles.gameImage}>
                {game.image ? (
                  <img src={game.image} alt={game.name} />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}
              </div>
              <div className={styles.gameInfo}>
                <div className={styles.gameTitle}>{game.name}</div>
                <div className={styles.gameDetails}>
                  {game.released && <span>({game.released})</span>}
                  {game.platforms && <span className={styles.platforms}>{game.platforms}</span>}
                </div>
                {game.rating && (
                  <div className={styles.gameRating}>
                    <span className={styles.ratingValue}>{game.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {query.length > 2 && games.length === 0 && !loading && !error && showResults && (
        <div className={styles.noResults}>
          Aucun jeu trouvé pour cette recherche
        </div>
      )}
    </div>
  );
}