/**
 * @fileoverview Model Sequelize pentru grupuri de prieteni
 * @module models/Grup
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

/**
 * Model Grup - reprezintă un grup de prieteni cu care se pot partaja alimente
 * @typedef {Object} Grup
 * @property {number} id - ID unic auto-incrementat
 * @property {string} nume - Numele grupului (obligatoriu)
 * @property {string|null} descriere - Descrierea grupului (opțional)
 */
const Grup = sequelize.define('Grup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nume: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    descriere: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'grupuri',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = Grup;
