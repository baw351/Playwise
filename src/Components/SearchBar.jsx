import { useState, useEffect } from 'react';
import { searchGames } from '../services/rawgAPI';
import './SearchBar.css'; 

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
      if (!event.target.closest('.search-container')) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-container">
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => games.length > 0 && setShowResults(true)}
          placeholder="Rechercher un jeu..."
          className="search-input"
        />
        {loading && <div className="loading-indicator">Chargement...</div>}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showResults && games.length > 0 && (
        <div className="search-results">
          <div className="results-header">Jeux</div>
          {games.map((game) => (
            <div key={game.id} className="game-item">
              <div className="game-image">
                {game.image ? (
                  <img src={game.image} alt={game.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="game-info">
                <div className="game-title">{game.name}</div>
                <div className="game-details">
                  {game.released && <span>({game.released})</span>}
                  {game.platforms && <span className="platforms">{game.platforms}</span>}
                </div>
                {game.rating && (
                  <div className="game-rating">
                    <span className="rating-value">{game.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {query.length > 2 && games.length === 0 && !loading && !error && showResults && (
        <div className="no-results">
          Aucun jeu trouvé pour cette recherche
        </div>
      )}
    </div>
  );
}