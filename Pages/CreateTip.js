import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGameDetails } from '../services/gameService';
import Header from '../Components/Layout/Header';
import Footer from '../Components/Layout/Footer';
import CreateTipForm from '../Components/Tips/CreateTipForm';
import './CreateTip.css';

function CreateTip() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <p>Chargement...</p>
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
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="create-tip-page">
        <div className="create-tip-header" style={{ backgroundImage: `url(${game.background_image})` }}>
          <div className="create-tip-header-content">
            <h1>Créer une astuce pour {game.name}</h1>
            <p>Partagez vos connaissances avec la communauté</p>
          </div>
        </div>
        
        <div className="create-tip-content">
          <CreateTipForm />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CreateTip;