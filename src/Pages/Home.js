import logo from '../Assets/logo.svg';
import './Home.css';
import SearchBar from '../Components/SearchBar';
import Header from '../Components/Header';

function Home() {
    return (
        <div className="Home">
            <Header/>
            <header className="Home-header">
                <img src={logo} className="Home-logo" alt="logo" />
                <p>
                    Edit <code>src/Home.js</code> and save to reload.
                </p>
                <a
                className="Home-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
                >
                Learn React
                </a>
            </header>
    </div>
    );
}

export default Home;
