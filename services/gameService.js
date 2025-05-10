import RAWG_API_KEY from './Api_Key.js';
const API_KEY = RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export async function getGameDetails(gameId) {
  if (!gameId) return null;
  
  const url = `${BASE_URL}/games/${gameId}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur: ${response.status}`);
    const data = await response.json();
    
    return formatGameDetails(data);
  } catch (error) {
    console.error('Erreur API (détails du jeu):', error);
    return null;
  }
}

export async function getGameScreenshots(gameId) {
  if (!gameId) return [];
  
  const url = `${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur: ${response.status}`);
    const data = await response.json();
    
    return data.results || [];
  } catch (error) {
    console.error('Erreur API (captures d\'écran):', error);
    return [];
  }
}

function formatGameDetails(game) {
  return {
    id: game.id,
    name: game.name,
    description: game.description_raw || game.description,
    background_image: game.background_image,
    background_image_additional: game.background_image_additional,
    website: game.website,
    released: game.released,
    rating: game.rating ? game.rating.toFixed(1) : 'N/A',
    metacritic: game.metacritic || null,
    ratings_count: game.ratings_count || 0,
    playtime: game.playtime || 0,
    publishers: game.publishers || [],
    developers: game.developers || [],
    genres: game.genres || [],
    platforms: game.platforms?.map(p => p.platform) || [],
    esrb_rating: game.esrb_rating,
    tags: game.tags || []
  };
}

export { searchGames, getPopularGames } from './rawgAPI.js';