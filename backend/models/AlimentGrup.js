/**
 * @fileoverview Model Sequelize pentru partajarea alimentelor în grupuri
 * @module models/AlimentGrup
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

/**
 * Model AlimentGrup - tabel de legătură pentru partajarea alimentelor la grupuri
 * @typedef {Object} AlimentGrup
 * @property {number} id - ID unic auto-incrementat
 * @property {number} aliment_id - FK către alimentul partajat
 * @property {number} grup_id - FK către grupul destinatar
 * @property {Date} shared_at - Data și ora partajării
 */
const AlimentGrup = sequelize.define('AlimentGrup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    aliment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    grup_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    shared_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'alimente_grup',
    timestamps: false,
});

module.exports = AlimentGrup;
