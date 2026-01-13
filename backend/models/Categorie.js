/**
 * @fileoverview Model Sequelize pentru categorii de alimente
 * @module models/Categorie
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

/**
 * Model Categorie - reprezintă o categorie de alimente (ex: Fructe, Legume)
 * @typedef {Object} Categorie
 * @property {number} id - ID unic auto-incrementat
 * @property {string} nume - Numele categoriei (unic, obligatoriu)
 */
const Categorie = sequelize.define('Categorie', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nume: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'categorii',
    timestamps: false,
});

module.exports = Categorie;
