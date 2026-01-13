/**
 * @fileoverview Context pentru autentificare
 * @module context/AuthContext
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

/**
 * Provider pentru autentificare
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verifică dacă există utilizator salvat
    useEffect(() => {
        const savedUser = localStorage.getItem('greenShelfUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Autentificare utilizator
     */
    const login = async (nume, parola) => {
        const data = await authAPI.login(nume, parola);
        if (data.error) {
            throw new Error(data.error);
        }
        setUser(data);
        localStorage.setItem('greenShelfUser', JSON.stringify(data));
        return data;
    };

    /**
     * Înregistrare utilizator nou
     */
    const register = async (nume, parola, email) => {
        const data = await authAPI.register(nume, parola, email);
        if (data.error) {
            throw new Error(data.error);
        }
        setUser(data);
        localStorage.setItem('greenShelfUser', JSON.stringify(data));
        return data;
    };

    /**
     * Deconectare utilizator
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem('greenShelfUser');
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
