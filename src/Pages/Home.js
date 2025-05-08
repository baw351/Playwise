import './Home.css';
import Layout from '../Components/Layout/Layout';

function Home() {
    return (
        <div className="home">
            <Layout>
            <main>
                <section className='actus'>
                    <h2>Actus récentes</h2>
                </section>
                <section className='jeux-populaires'>
                    <h2>Jeux Populaires</h2>
                </section>
                <section className='tendances'>
                    <h2>Tendances en ce moment</h2>
                </section>
                <section className='communauté'>
                    <h2>Communautés</h2>
                </section>
            </main>
            </Layout>
        </div>
    );
};

export default Home;