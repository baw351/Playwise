import RAWG_API_KEY from './Api_Key.js';
const API_KEY = RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export async function searchGames(query) {
  if (!query || query.length < 3) return [];

  const url = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=4`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur: ${response.status}`);
    const data = await response.json();

    return formatGames(data.results);
  } catch (error) {
    console.error('Erreur API:', error);
    return [];
  }
}

export async function getPopularGames() {
  const url = `${BASE_URL}/games?key=${API_KEY}&ordering=-added&page_size=8`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur: ${response.status}`);
    const data = await response.json();

    return formatGames(data.results);
  } catch (error) {
    console.error('Erreur API (populaires):', error);
    return [];
  }
}

function formatGames(games) {
  return games.map(game => ({
    id: game.id,
    name: game.name,
    image: game.background_image,
    background_image: game.background_image,
    released: game.released ? new Date(game.released).getFullYear() : 'N/A',
    rating: game.rating ? game.rating.toFixed(1) : 'N/A',
    metacritic: game.metacritic || null,
    ratings_count: game.ratings_count || 0,
    genres: game.genres || [],
  }));
}
