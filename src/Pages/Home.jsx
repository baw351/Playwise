import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import Layout from '../Components/Layout/Layout';
import HeroSection from '../Components/Home/HeroSection';
import GameGrid from '../Components/Games/GameGrid';
import { getPopularGames } from '../services/rawgAPI';


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
    <div className={styles.home}>
      <Layout>
        <main>
          <HeroSection />
          <section className={styles.section}>
            <h2>Jeux Populaires</h2>
            <GameGrid games={games} loading={loading} />
          </section>
          <section className={styles.section}>
            <h2>Actus récentes</h2>
          </section>
          <section className={styles.section}>
            <h2>Tendances en ce moment</h2>
          </section>
          <section className={styles.section}>
            <h2>Communautés</h2>
          </section>
        </main>
      </Layout>
    </div>
  );
}

export default Home;