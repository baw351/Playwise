import React, { useState, useEffect } from 'react';
import GameCard from '../Components/GameCard';
import { getPopularGames, searchGames } from '../services/gameService';
import './HomePage.css';

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularGames = async () => {
      try {
        setLoading(true);
        const data = await getPopularGames();
        setGames(data);
      } catch (err) {
        setError('Erreur lors du chargement des jeux populaires');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularGames();
  }, []);
  
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length < 3) {
        if (searchQuery === '') {
          const popularGames = await getPopularGames();
          setGames(popularGames);
          setSearching(false);
        }
        return;
      }
      
      try {
        setSearching(true);
        const results = await searchGames(searchQuery);
        setGames(results);
      } catch (err) {
        console.error('Erreur de recherche:', err);
      } finally {
        setSearching(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Améliore tes compétences de jeu</h1>
          <p>Découvre des guides, stratégies et astuces créés par la communauté pour tes jeux préférés. Partage aussi ton expertise et aide les autres à surmonter tous les défis.</p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un jeu..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="games-section">
        <div className="section-header">
          <h2>{searchQuery.length >= 3 ? 'Résultats de recherche' : 'Jeux populaires'}</h2>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loader"></div>
            <p>Chargement des jeux...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Réessayer
            </button>
          </div>
        ) : games.length === 0 ? (
          <div className="no-results">
            <p>Aucun jeu trouvé{searchQuery ? ` pour "${searchQuery}"` : ''}.</p>
          </div>
        ) : (
          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-card-container">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;