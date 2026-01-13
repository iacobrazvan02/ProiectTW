/**
 * @fileoverview Agregator pentru toate rutele
 * @module routes/index
 */

const express = require('express');
const router = express.Router();

const alimenteRoutes = require('./alimenteRoutes');
const grupuriRoutes = require('./grupuriRoutes');
const authRoutes = require('./authRoutes');
const grupuriController = require('../controllers/grupuriController');

// Rute pentru alimente
router.use('/alimente', alimenteRoutes);
router.get('/alerts', alimenteRoutes);

// Rută specială pentru adăugare (menținere compatibilitate)
router.post('/adauga', require('../controllers/alimenteController').addAliment);

// Rute pentru ofertă și claim (la rădăcină pentru compatibilitate)
router.put('/ofera/:id', require('../controllers/alimenteController').toggleOfera);
router.post('/claim/:id', require('../controllers/alimenteController').claimAliment);
router.post('/undo-claim/:id', require('../controllers/alimenteController').undoClaim);

// Rute pentru grupuri
router.use('/grupuri', grupuriRoutes);

// Rute pentru autentificare
router.use('/auth', authRoutes);
router.get('/utilizatori', require('../controllers/authController').getUtilizatori);
router.post('/utilizatori', require('../controllers/authController').createUtilizator);

// Rute pentru invitații (la rădăcină)
router.get('/invite/:token', grupuriController.viewInvite);
router.post('/invite/:token/accept', grupuriController.acceptInvite);

// Rute pentru share alimente
router.post('/alimente/:id/share', grupuriController.shareAlimentToGrup);
router.post('/alimente/share-categorie', grupuriController.shareCategorieToGrup);

// Categorii
router.get('/categorii', async (req, res) => {
    try {
        const Categorie = require('../models/Categorie');
        const categorii = await Categorie.findAll({ order: [['nume', 'ASC']] });
        res.json(categorii);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la categorii');
    }
});

// Share social (mock)
router.post('/share', (req, res) => {
    console.log('Share request:', req.body);
    res.json({ ok: true });
});

module.exports = router;
