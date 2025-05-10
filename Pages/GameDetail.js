import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGameDetails, getGameScreenshots } from '../services/gameService';
import Header from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import './GameDetail.css';

const Badge = ({ text }) => (
  <span className="badge">{text}</span>
);

const RatingBadge = ({ value, max = 100 }) => {
  let colorClass = 'low';
  if (value >= 75) colorClass = 'high';
  else if (value >= 50) colorClass = 'medium';
  
  return (
    <span className={`rating-badge ${colorClass}`}>
      {value}
    </span>
  );
};

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        const gameData = await getGameDetails(id);
        const screenshotsData = await getGameScreenshots(id);
        
        if (gameData) {
          setGame(gameData);
          setScreenshots(screenshotsData);
        } else {
          setError('Impossible de charger les détails du jeu');
        }
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Chargement des détails du jeu...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !game) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h2>Oups !</h2>
          <p>{error || "Ce jeu n'a pas été trouvé"}</p>
          <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
        <Footer />
      </>
    );
  }

  const allImages = [
    { id: 'main', image: game.background_image },
    ...(screenshots.map(s => ({ id: s.id, image: s.image })))
  ].filter(img => img.image);

  const handleImageClick = (index) => {
    setActiveImage(index);
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    }).format(date);
  };

  return (
    <>
      <Header />
      <div className="game-detail-page">
        <div 
          className="game-header" 
          style={{ backgroundImage: `url(${game.background_image})` }}
        >
          <div className="header-content">
            <h1>{game.name}</h1>
            <div className="game-ratings">
              {game.metacritic && (
                <div className="rating-item">
                  <span className="rating-label">Metacritic</span>
                  <RatingBadge value={game.metacritic} />
                </div>
              )}
              {game.rating !== 'N/A' && (
                <div className="rating-item">
                  <span className="rating-label">RAWG</span>
                  <span className="rating-value">{game.rating}/5</span>
                  <span className="rating-count">({game.ratings_count} votes)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="game-content">
          <div className="game-main-info">
            <div className="game-gallery">
              <div className="main-image-container">
                {allImages.length > 0 && (
                  <img 
                    src={allImages[activeImage].image} 
                    alt={`${game.name} screenshot`} 
                    className="main-image"
                  />
                )}
              </div>
              {allImages.length > 1 && (
                <div className="thumbnails">
                  {allImages.slice(0, 5).map((img, index) => (
                    <div 
                      key={img.id} 
                      className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                      onClick={() => handleImageClick(index)}
                    >
                      <img src={img.image} alt={`${game.name} thumbnail ${index}`} />
                    </div>
                  ))}
                  {allImages.length > 5 && (
                    <div className="more-images">
                      <span>+{allImages.length - 5}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="game-info">
              <div className="info-section">
                <h2>À propos</h2>
                <p className="game-description">{game.description}</p>
                
                <div className="tips-button-container">
                    <Link to={`/game/${id}/tips`} className="btn btn-tips">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.663 17h4.673M12 3c-1.364 0-2.63.37-3.72 1.014M12 3c1.364 0 2.63.37 3.72 1.014M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9c0-1.856.565-3.616 1.578-5.07L12 3z"/>
                    <path d="M12 12l-2-2m2 2l-2 2m2-2l2-2m-2 2l2 2"/>
                    </svg>
                    Voir les astuces de la communauté
                    </Link>
                    </div>

              </div>

              <div className="info-section">
                <h3>Détails</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Date de sortie</span>
                    <span className="info-value">{formatReleaseDate(game.released)}</span>
                  </div>

                  {game.developers?.length > 0 && (
                    <div className="info-item">
                      <span className="info-label">Développeur{game.developers.length > 1 ? 's' : ''}</span>
                      <span className="info-value">
                        {game.developers.map(dev => dev.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {game.publishers?.length > 0 && (
                    <div className="info-item">
                      <span className="info-label">Éditeur{game.publishers.length > 1 ? 's' : ''}</span>
                      <span className="info-value">
                        {game.publishers.map(pub => pub.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {game.playtime > 0 && (
                    <div className="info-item">
                      <span className="info-label">Temps de jeu moyen</span>
                      <span className="info-value">{game.playtime} heures</span>
                    </div>
                  )}

                  {game.website && (
                    <div className="info-item">
                      <span className="info-label">Site officiel</span>
                      <a href={game.website} target="_blank" rel="noopener noreferrer" className="website-link">
                        Visiter le site
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {game.genres?.length > 0 && (
                <div className="info-section">
                  <h3>Genres</h3>
                  <div className="badges-container">
                    {game.genres.map(genre => (
                      <Badge key={genre.id} text={genre.name} />
                    ))}
                  </div>
                </div>
              )}

              {game.platforms?.length > 0 && (
                <div className="info-section">
                  <h3>Plateformes</h3>
                  <div className="badges-container">
                    {game.platforms.map(platform => (
                      <Badge key={platform.id} text={platform.name} />
                    ))}
                  </div>
                </div>
              )}

              {game.esrb_rating && (
                <div className="info-section">
                  <h3>Classification</h3>
                  <div className="esrb-rating">
                    <span className="esrb-badge">{game.esrb_rating.name}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {game.tags?.length > 0 && (
            <div className="tags-section">
              <h3>Tags</h3>
              <div className="tags-container">
                {game.tags.slice(0, 20).map(tag => (
                  <Badge key={tag.id} text={tag.name} />
                ))}
              </div>
            </div>
          )}

          <div className="actions">
            <Link to="/" className="btn btn-secondary">Retour aux jeux</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GameDetail;