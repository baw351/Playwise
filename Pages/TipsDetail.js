import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import { getGameDetails } from '../services/gameService';
import CommentSection from '../Components/Tips/CommentSection';
import './TipDetail.css';

function TipDetail() {
  const { id, tipId } = useParams();
  const [game, setGame] = useState(null);
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteStatus, setVoteStatus] = useState('none'); 
  const [voteCount, setVoteCount] = useState({ up: 0, down: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const gameData = await getGameDetails(id);
        if (gameData) {
          setGame(gameData);
        } else {
          setError('Impossible de charger les détails du jeu');
          return;
        }

        const mockTipData = JSON.parse(localStorage.getItem(`tip-${tipId}`)) || {
          id: tipId,
          title: "Astuce de démo",
          content: "Contenu de l'astuce de démonstration. Dans une application réelle, ces données viendraient de votre backend.",
          author: "Utilisateur",
          date: new Date().toISOString(),
          category: "general",
          images: [],
          videoUrl: "",
          upvotes: 12,
          downvotes: 3
        };
        
        setTip(mockTipData);
        setVoteCount({ up: mockTipData.upvotes || 0, down: mockTipData.downvotes || 0 });
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, tipId]);

  const handleVote = (type) => {
    if (voteStatus === type) {
      setVoteStatus('none');
      setVoteCount({
        ...voteCount,
        [type]: voteCount[type] - 1
      });
    } 
    else if (voteStatus !== 'none') {
      setVoteStatus(type);
      setVoteCount({
        up: type === 'up' ? voteCount.up + 1 : voteCount.up - (voteStatus === 'up' ? 1 : 0),
        down: type === 'down' ? voteCount.down + 1 : voteCount.down - (voteStatus === 'down' ? 1 : 0)
      });
    } 

    else {
      setVoteStatus(type);
      setVoteCount({
        ...voteCount,
        [type]: voteCount[type] + 1
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const renderVideoEmbed = () => {
    if (!tip?.videoUrl) return null;

    let embedUrl = '';

    if (tip.videoUrl.includes('youtube.com') || tip.videoUrl.includes('youtu.be')) {
      const videoId = tip.videoUrl.includes('v=')
        ? tip.videoUrl.split('v=')[1].split('&')[0]
        : tip.videoUrl.split('/').pop().split('?')[0];
      
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    else if (tip.videoUrl.includes('twitch.tv')) {
      const channelName = tip.videoUrl.split('twitch.tv/')[1].split('/')[0];
      embedUrl = `https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}`;
    }

    if (!embedUrl) return null;

    return (
      <div className="tip-video-container">
        <iframe 
          src={embedUrl}
          title="Vidéo intégrée" 
          frameBorder="0" 
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const renderImages = () => {
    if (!tip?.images || tip.images.length === 0) return null;
    
    return (
      <div className="tip-images-gallery">
        {tip.images.map((image, index) => (
          <div key={index} className="tip-image-item">
            <img 
              src={image.url || image} 
              alt={`Illustration ${index + 1}`} 
              className="tip-detail-image"
            />
          </div>
        ))}
      </div>
    );
  };

  const renderCategory = () => {
    if (!tip?.category) return null;
    
    const categories = {
      'general': { label: 'Conseil général', color: '#6c757d' },
      'walkthrough': { label: 'Guide', color: '#28a745' },
      'secret': { label: 'Secret', color: '#dc3545' },
      'achievement': { label: 'Trophée', color: '#ffc107' },
      'build': { label: 'Build', color: '#17a2b8' },
      'strategy': { label: 'Stratégie', color: '#6f42c1' }
    };
    
    const category = categories[tip.category] || { label: tip.category, color: '#6c757d' };
    
    return (
      <span 
        className="tip-category" 
        style={{ backgroundColor: category.color }}
      >
        {category.label}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Chargement...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !game || !tip) {
    return (
      <>
        <Header />
        <div className="error-container">
          <h2>Oups !</h2>
          <p>{error || "Cette astuce n'a pas été trouvée"}</p>
          <Link to={`/game/${id}/tips`} className="btn-return">
            Retour aux astuces
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="tip-detail-page">
        <div className="tip-detail-header" style={{ backgroundImage: `url(${game.background_image})` }}>
          <div className="tip-detail-header-content">
            <h1>{tip.title}</h1>
            <div className="tip-meta-info">
              <div className="tip-game-info">
                <Link to={`/game/${id}`} className="game-link">
                  {game.name}
                </Link>
                {renderCategory()}
              </div>
              <div className="tip-author-info">
                <span className="tip-author">Par {tip.author}</span>
                <span className="tip-date">{formatDate(tip.date)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="tip-detail-content">
          <article className="tip-article">
            <div className="tip-navigation">
              <Link to={`/game/${id}/tips`} className="btn-back">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                Retour aux astuces
              </Link>
            </div>
            
            <div className="tip-main-content">
              <p className="tip-content-text">{tip.content}</p>
              
              {renderImages()}
              {renderVideoEmbed()}
              
              <div className="tip-vote-section">
                <p>Cette astuce vous a-t-elle été utile ?</p>
                <div className="tip-vote-buttons">
                  <button 
                    className={`btn-vote btn-upvote ${voteStatus === 'up' ? 'active' : ''}`}
                    onClick={() => handleVote('up')}
                    aria-label="Utile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                    </svg>
                    <span>Utile</span>
                    <span className="vote-count">{voteCount.up}</span>
                  </button>
                  
                  <button 
                    className={`btn-vote btn-downvote ${voteStatus === 'down' ? 'active' : ''}`}
                    onClick={() => handleVote('down')}
                    aria-label="Pas utile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
                    </svg>
                    <span>Pas utile</span>
                    <span className="vote-count">{voteCount.down}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="tip-share-section">
              <h3>Partager cette astuce</h3>
              <div className="social-share-buttons">
                <button className="btn-share facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                  Facebook
                </button>
                <button className="btn-share twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                  Twitter
                </button>
                <button className="btn-share copy">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                  </svg>
                  Copier le lien
                </button>
              </div>
            </div>
          </article>
          
          <div className="tip-comments-section">
            <h3>Commentaires</h3>
            <CommentSection tipId={tipId} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TipDetail;