import styles from './Header.module.css';
import logo from "../Assets/logo.svg";
import SearchBar from './SearchBar';

function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.logo}>
                    <img src={logo} alt="Logo" className={styles.logoImage} />
                </div>
                <SearchBar />
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}><a href="/">Home</a></li>
                        <li className={styles.navItem}><a href="/about">About</a></li>
                        <li className={styles.navItem}><a href="/contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;