/**
 * @fileoverview Rute pentru autentificare
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/register - Înregistrare
router.post('/register', authController.register);

// POST /auth/login - Autentificare
router.post('/login', authController.login);

// GET /utilizatori - Listează utilizatori
router.get('/utilizatori', authController.getUtilizatori);

// POST /utilizatori - Creează utilizator
router.post('/utilizatori', authController.createUtilizator);

module.exports = router;
