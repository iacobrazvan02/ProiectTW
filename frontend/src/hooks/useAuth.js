/**
 * @fileoverview Hook personalizat pentru autentificare
 * @module hooks/useAuth
 */

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Hook pentru a accesa contextul de autentificare
 * @returns {Object} Metode și state de autentificare (user, login, register, logout)
 * @throws {Error} Dacă este folosit în afara AuthProvider
 */
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;
