/**
 * @fileoverview Model Sequelize pentru alimente
 * @module models/Aliment
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

/**
 * Model Aliment - reprezintă un produs alimentar din inventar
 * @typedef {Object} Aliment
 * @property {number} id - ID unic auto-incrementat
 * @property {string} nume - Numele alimentului (obligatoriu)
 * @property {string|null} descriere - Descriere sau observații
 * @property {number|null} categorie_id - FK către categoria produsului
 * @property {string|null} cantitate - Cantitate text (ex: "2 kg")
 * @property {number|null} cantitate_nr - Cantitate numerică în kg
 * @property {number|null} pret_per_kg - Prețul per kilogram
 * @property {Date|null} data_expirare - Data de expirare
 * @property {boolean} disponibil - Dacă produsul este oferit comunității
 * @property {number|null} claimed_by - FK către utilizatorul care a revendicat
 */
const Aliment = sequelize.define('Aliment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nume: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    descriere: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    categorie_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    cantitate: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    cantitate_nr: {
        type: DataTypes.DECIMAL(10, 3),
        allowNull: true,
    },
    pret_per_kg: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    data_expirare: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    disponibil: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    claimed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'alimente',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = Aliment;
