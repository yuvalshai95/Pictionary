import React, { useState, useEffect } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';

import { NavLink } from 'react-router-dom';

// Services

// Actions


export function AppHeader() {
    const [isMenuOpen, setMenuState] = useState(false)

    const toggleMenu = () => {
        setMenuState(!isMenuOpen)
    }

    return (
        <header className='app-header'>
            <div className={`screen-overlay ${(isMenuOpen) ? 'open' : ''}`} onClick={() => {
                toggleMenu()
            }}></div>
            <section className='header-content'>

                <NavLink className="logo" to="/">Logo</NavLink>
                <nav className='nav-container'>
                    <ul className={`nav-links clean-list ${(isMenuOpen) ? 'open' : ''}`}>
                        <NavLink to="/"> <li>Home</li></NavLink>
                        <NavLink to="/other"> <li>Other</li></NavLink>
                        <NavLink to="/about"> <li>About</li></NavLink>
                        <NavLink to="/contact"> <li>Contact</li></NavLink>
                    </ul>
                </nav>
                <button className="hamburger-btn" onClick={() => {
                    toggleMenu()
                }}>
                    <GiHamburgerMenu className="hamburger-icon" />
                </button>
            </section>
        </header>
    );
}
