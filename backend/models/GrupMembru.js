/**
 * @fileoverview Model Sequelize pentru membrii grupurilor
 * @module models/GrupMembru
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

/**
 * Model GrupMembru - tabel de legătură între grupuri și utilizatori
 * Permite adăugarea de etichete (vegetarian, carnivor, etc.)
 * @typedef {Object} GrupMembru
 * @property {number} id - ID unic auto-incrementat
 * @property {number} grup_id - FK către grupul părinte
 * @property {number} utilizator_id - FK către utilizator
 * @property {string|null} etichete - Etichete pentru membru (ex: "vegetarian, iubitor de zacuscă")
 */
const GrupMembru = sequelize.define('GrupMembru', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    grup_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    utilizator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    etichete: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'grupuri_membri',
    timestamps: false,
});

module.exports = GrupMembru;
