import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import logo from "../../Assets/logo.svg";
import SearchBar from '../SearchBar';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';

function Header() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [initialTab, setInitialTab] = useState('login');
    const { currentUser } = useAuth();

    const openAuthModal = (tab) => {
        setInitialTab(tab);
        setAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setAuthModalOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContainer}>
                <div className={styles.logo}>
                    <Link to="/">
                        <img src={logo} alt="Logo" className={styles.logoImage} />
                    </Link>
                </div>
                <SearchBar />
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}><Link to="/">Accueil</Link></li>
                        <li className={styles.navItem}><Link to="/about">À Propos</Link></li>
                        <li className={styles.navItem}><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>

                <div className={styles.authContainer}>
                    {currentUser ? (
                        <UserMenu user={currentUser} />
                    ) : (
                        <>
                            <button 
                                className={`${styles.authButton} ${styles.loginButton}`}
                                onClick={() => openAuthModal('login')}
                            >
                                Se connecter
                            </button>
                            <button 
                                className={`${styles.authButton} ${styles.registerButton}`}
                                onClick={() => openAuthModal('register')}
                            >
                                S'inscrire
                            </button>
                        </>
                    )}
                </div>
            </div>

            <AuthModal 
                isOpen={authModalOpen} 
                onClose={closeAuthModal}
                initialTab={initialTab}
            />
        </header>
    );
}

export default Header;