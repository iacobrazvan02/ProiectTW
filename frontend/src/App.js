/**
 * @fileoverview Aplicație React pentru GreenShelf - Previne Risipa de Alimente
 * Punct de intrare principal cu structură modulară
 * @author GreenShelf Team
 * @version 3.0.0
 */

import React from 'react';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

/**
 * Componentă pentru rutarea bazată pe autentificare
 */
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>🥬 GreenShelf</h1>
          <p>Se încarcă...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
};

/**
 * Componenta principală a aplicației
 * Wrap-uită aplicația cu AuthProvider pentru management de stare
 */
function App() {
  return (
    <div className="root">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App;