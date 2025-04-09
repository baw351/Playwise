const API_KEY = 'YOUR API'; 
const BASE_URL = 'https://api.rawg.io/api';

export async function searchGames(query) {
  if (!query || query.length < 3) return [];
  
  const url = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=4`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des jeux: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.map(game => ({
      id: game.id,
      name: game.name,
      image: game.background_image,
      released: game.released ? new Date(game.released).getFullYear() : 'N/A',
      rating: game.rating ? game.rating.toFixed(1) : 'N/A',
      platforms: game.platforms ? game.platforms.map(p => p.platform.name).slice(0, 3).join(', ') : 'N/A'
    }));
  } catch (error) {
    console.error('Erreur API:', error);
    return [];
  }
}