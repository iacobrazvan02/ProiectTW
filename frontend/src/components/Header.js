/**
 * @fileoverview Componentă Header
 * @module components/Header
 */

import React from 'react';
import useAuth from '../hooks/useAuth';

/**
 * Componentă Header pentru aplicație
 */
const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div>
                <h1>🥬 GreenShelf — Previne Risipa de Alimente</h1>
                <p>Donează sau revendică alimentele din comunitate</p>
            </div>
            <div className="header-user">
                <span>👤 {user?.nume}</span>
                <button className="btn btn-ghost" onClick={logout}>
                    Deconectare
                </button>
            </div>
        </header>
    );
};

export default Header;
