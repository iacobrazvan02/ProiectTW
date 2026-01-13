/**
 * @fileoverview Model Sequelize pentru utilizatori cu autentificare
 * @module models/Utilizator
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

/**
 * Model Utilizator - reprezintă un utilizator al aplicației
 * @typedef {Object} Utilizator
 * @property {number} id - ID unic auto-incrementat
 * @property {string} nume - Numele utilizatorului (obligatoriu, unic pentru login)
 * @property {string|null} email - Adresa de email (opțional)
 * @property {string|null} parola - Parola hash-uită (opțional pentru utilizatori legacy)
 * @property {string|null} preferinte - Preferințe alimentare (opțional)
 */
const Utilizator = sequelize.define('Utilizator', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nume: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    parola: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    preferinte: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'utilizatori',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = Utilizator;
