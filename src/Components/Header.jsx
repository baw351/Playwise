import { useState, useEffect } from 'react';
import './Header.css';
import logo from "../Assets/logo.svg";
import SearchBar from './SearchBar';

function Header() {
    return(
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Logo" className="logo-image" />
            </div>
            <SearchBar/>
            <nav className="nav">
                <ul className="nav-list">
                    <li className="nav-item"><a href="/">Home</a></li>
                    <li className="nav-item"><a href="/about">About</a></li>
                    <li className="nav-item"><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
    )
};

export default Header;