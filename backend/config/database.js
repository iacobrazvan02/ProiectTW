/**
 * @fileoverview Configurare conexiune bază de date
 * @module config/database
 */

const { Sequelize } = require('sequelize');
const path = require('path');

/**
 * Instanță Sequelize configurată pentru SQLite
 * Baza de date este stocată local în fișierul database.sqlite
 */
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false, // Setează la console.log pentru a vedea query-urile SQL
});

module.exports = sequelize;
