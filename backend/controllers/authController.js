/**
 * @fileoverview Controller pentru autentificare
 * @module controllers/authController
 */

const bcrypt = require('bcryptjs');
const Utilizator = require('../models/Utilizator');

/**
 * Înregistrare utilizator nou
 */
const register = async (req, res) => {
    try {
        const { nume, parola, email } = req.body;

        if (!nume || !parola) {
            return res.status(400).json({ error: 'Numele și parola sunt obligatorii' });
        }

        if (parola.length < 4) {
            return res.status(400).json({ error: 'Parola trebuie să aibă minim 4 caractere' });
        }

        const existent = await Utilizator.findOne({ where: { nume } });
        if (existent) {
            return res.status(400).json({ error: 'Numele de utilizator este deja folosit' });
        }

        const salt = await bcrypt.genSalt(10);
        const parolaHash = await bcrypt.hash(parola, salt);

        const utilizator = await Utilizator.create({
            nume,
            parola: parolaHash,
            email: email || null,
        });

        res.json({
            id: utilizator.id,
            nume: utilizator.nume,
            email: utilizator.email,
            message: 'Înregistrare reușită!',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la înregistrare');
    }
};

/**
 * Autentificare utilizator
 */
const login = async (req, res) => {
    try {
        const { nume, parola } = req.body;

        if (!nume || !parola) {
            return res.status(400).json({ error: 'Numele și parola sunt obligatorii' });
        }

        const utilizator = await Utilizator.findOne({ where: { nume } });
        if (!utilizator) {
            return res.status(401).json({ error: 'Nume de utilizator sau parolă incorectă' });
        }

        if (!utilizator.parola) {
            return res.status(401).json({ error: 'Acest cont nu are parolă setată. Te rugăm să te înregistrezi.' });
        }

        const parolaValida = await bcrypt.compare(parola, utilizator.parola);
        if (!parolaValida) {
            return res.status(401).json({ error: 'Nume de utilizator sau parolă incorectă' });
        }

        res.json({
            id: utilizator.id,
            nume: utilizator.nume,
            email: utilizator.email,
            preferinte: utilizator.preferinte,
            message: 'Autentificare reușită!',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la autentificare');
    }
};

/**
 * Listează toți utilizatorii
 */
const getUtilizatori = async (req, res) => {
    try {
        const utilizatori = await Utilizator.findAll({
            attributes: ['id', 'nume', 'email', 'preferinte', 'created_at'],
        });
        res.json(utilizatori);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la utilizatori');
    }
};

/**
 * Creează un utilizator (fără parolă)
 */
const createUtilizator = async (req, res) => {
    try {
        const { nume, email, preferinte } = req.body;
        const utilizator = await Utilizator.create({
            nume,
            email: email || null,
            preferinte: preferinte || null,
        });
        res.json(utilizator);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare creare utilizator');
    }
};

module.exports = {
    register,
    login,
    getUtilizatori,
    createUtilizator,
};
