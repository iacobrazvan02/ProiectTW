/**
 * @fileoverview Model Sequelize pentru revendicări (claims) de alimente
 * @module models/Claim
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

/**
 * Model Claim - înregistrează revendicările de alimente de către utilizatori
 * @typedef {Object} Claim
 * @property {number} id - ID unic auto-incrementat
 * @property {number} aliment_id - FK către alimentul revendicat
 * @property {number|null} utilizator_id - FK către utilizatorul care revendică
 * @property {Date} data_claim - Data și ora revendicării
 */
const Claim = sequelize.define('Claim', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    aliment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    utilizator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'claims',
    timestamps: true,
    createdAt: 'data_claim',
    updatedAt: false,
});

module.exports = Claim;
