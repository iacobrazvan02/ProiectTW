/**
 * @fileoverview Model Sequelize pentru invitații la grupuri
 * @module models/GrupInvite
 */

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

/**
 * Model GrupInvite - gestionează invitațiile trimise pentru a accesa lista de alimente
 * @typedef {Object} GrupInvite
 * @property {number} id - ID unic auto-incrementat
 * @property {number} grup_id - FK către grupul pentru care se face invitația
 * @property {string|null} email - Email-ul destinatarului invitației
 * @property {string} token - Token unic pentru accesarea listei
 * @property {string} status - Starea invitației: 'pending', 'accepted', 'declined'
 */
const GrupInvite = sequelize.define('GrupInvite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    grup_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    token: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING(30),
        defaultValue: 'pending',
    },
}, {
    tableName: 'grup_invite',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

module.exports = GrupInvite;
