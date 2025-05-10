import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGameDetails } from '../services/gameService';
import Header from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import './GameTips.css';

function GameTips() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Using useState with initial tips data
  const [tips, setTips] = useState([
    {
      id: 1,
      title: "Débloquer tous les personnages secrets",
      author: "GameMaster42",
      content: "Pour débloquer les personnages secrets, vous devez terminer le mode histoire à 100% et ensuite visiter la statue cachée dans la zone nord de la carte principale.",
      likes: 145,
      date: "2024-03-15"
    },
    {
      id: 2,
      title: "Comment battre le boss final facilement",
      author: "ProGamer99",
      content: "Le boss final a un point faible caché sous son armure. Attendez qu'il lance son attaque spéciale, puis visez la partie brillante sur son dos. Trois coups bien placés et il sera vaincu!",
      likes: 234,
      date: "2024-04-02"
    },
    {
      id: 3,
      title: "Trouver toutes les armes légendaires",
      author: "TreasureHunter",
      content: "Les armes légendaires sont cachées dans des coffres spéciaux qui n'apparaissent que pendant les nuits de pleine lune dans le jeu. Consultez votre calendrier in-game et préparez-vous à explorer!",
      likes: 189,
      date: "2024-04-20"
    }
  ]);

  const handleLike = (tipId) => {
    setTips(currentTips => 
      currentTips.map(tip => 
        tip.id === tipId ? { ...tip, likes: tip.likes + 1 } : tip
      )
    );
  };

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        const gameData = await getGameDetails(id);
        
        if (gameData) {
          setGame(gameData);
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
          <p>Chargement des astuces...</p>
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleCreateTip = () => {
    navigate(`/game/${id}/tips/create`);
  };

  return (
    <>
      <Header />
      <div className="game-tips-page">
        <div className="tips-header" style={{ backgroundImage: `url(${game.background_image})` }}>
          <div className="tips-header-content">
            <h1>Astuces pour {game.name}</h1>
            <p>Découvrez les meilleurs conseils et stratégies partagés par la communauté</p>
          </div>
        </div>

        <div className="tips-content">
          <div className="tips-nav">
            <Link to={`/game/${id}`} className="btn btn-back">
              &larr; Retour à la fiche du jeu
            </Link>
            <button className="btn btn-create-tip" onClick={handleCreateTip}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Partager une astuce
            </button>
          </div>

          <div className="tips-section">
            <h2>Astuces de la communauté</h2>
            
            {tips.length === 0 ? (
              <div className="no-tips">
                <p>Aucune astuce n'a encore été partagée pour ce jeu.</p>
                <p>Soyez le premier à partager votre expertise !</p>
                <button className="btn btn-primary">Créer une astuce</button>
              </div>
            ) : (
              <div className="tips-list">
                {tips.map(tip => (
                  <div key={tip.id} className="tip-card">
                    <div className="tip-header">
                      <h3 className="tip-title">{tip.title}</h3>
                      <div className="tip-meta">
                        <span className="tip-author">Par {tip.author}</span>
                        <span className="tip-date">{formatDate(tip.date)}</span>
                      </div>
                    </div>
                    <div className="tip-content">
                      <p>{tip.content}</p>
                    </div>
                    <div className="tip-footer">
                        <button className="btn-like" onClick={() => handleLike(tip.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                            </svg>
                            <span>{tip.likes}</span>
                        </button>
                        <button className="btn-share">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                            </svg>
                            Partager
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default GameTips;