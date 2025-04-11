import './Home.css';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

function Home() {
    return (
        <div className="home">
            <Header/>
            <main>
                <div className='actus'>
                    <h2>Actus récentes</h2>
                </div>
                <div className='jeux-populaires'>
                    <h2>Jeux Populaires</h2>
                </div>
                <div className='tendances'>
                    <h2>Tendances en ce moment</h2>
                </div>
                <div className='communauté'>
                    <h2>Communautés</h2>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default Home;
