/**
 * @fileoverview Pagina de autentificare
 * @module pages/LoginPage
 */

import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';

/**
 * Pagina de login și înregistrare
 */
const LoginPage = () => {
    const { login, register } = useAuth();
    const [authMode, setAuthMode] = useState('login');
    const [authNume, setAuthNume] = useState('');
    const [authParola, setAuthParola] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [authError, setAuthError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');

        try {
            if (authMode === 'login') {
                await login(authNume, authParola);
            } else {
                await register(authNume, authParola, authEmail || null);
            }
        } catch (err) {
            setAuthError(err.message || 'Eroare la autentificare');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>🥬 GreenShelf</h1>
                <p>Previne Risipa de Alimente</p>

                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
                        onClick={() => {
                            setAuthMode('login');
                            setAuthError('');
                        }}
                    >
                        Autentificare
                    </button>
                    <button
                        className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
                        onClick={() => {
                            setAuthMode('register');
                            setAuthError('');
                        }}
                    >
                        Înregistrare
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <input
                        type="text"
                        placeholder="Nume utilizator"
                        value={authNume}
                        onChange={(e) => setAuthNume(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Parola"
                        value={authParola}
                        onChange={(e) => setAuthParola(e.target.value)}
                        required
                        minLength={4}
                    />
                    {authMode === 'register' && (
                        <input
                            type="email"
                            placeholder="Email (opțional)"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                        />
                    )}

                    {authError && <div className="auth-error">{authError}</div>}

                    <button type="submit" className="btn btn-primary auth-submit">
                        {authMode === 'login' ? 'Intră în cont' : 'Creează cont'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
