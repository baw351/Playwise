import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import Layout from '../Components/Layout/Layout';
import HeroSection from '../Components/Home/HeroSection';
import GameGrid from '../Components/Games/GameGrid';
import { getPopularGames } from '../services/rawgAPI';
import RecentTipsPlaceholder from '../Components/Home/RecentTipsPlaceholder';

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularGames().then(data => {
      setGames(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className={styles.page}>
      <Layout>
        <HeroSection />
        <section className={styles.section}>
          <h2>Jeux Populaires</h2>
          <GameGrid games={games} loading={loading} />
        </section>
        <section className={styles.section}>
          <h2>Dernières astuces</h2>
          <RecentTipsPlaceholder/>
        </section>
      </Layout>
    </div>
  );
}

export default Home;