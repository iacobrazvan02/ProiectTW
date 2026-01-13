/**
 * @fileoverview Rute pentru alimente
 * @module routes/alimenteRoutes
 */

const express = require('express');
const router = express.Router();
const alimenteController = require('../controllers/alimenteController');

// GET /alimente - Listează toate alimentele
router.get('/', alimenteController.getAlimente);

// POST /adauga - Adaugă un aliment nou
router.post('/adauga', alimenteController.addAliment);

// PUT /ofera/:id - Toggle disponibilitate
router.put('/ofera/:id', alimenteController.toggleOfera);

// POST /claim/:id - Revendică un produs
router.post('/claim/:id', alimenteController.claimAliment);

// POST /undo-claim/:id - Anulează ultimul claim
router.post('/undo-claim/:id', alimenteController.undoClaim);

// DELETE /alimente/:id - Șterge un aliment
router.delete('/:id', alimenteController.deleteAliment);

// GET /alerts - Alerte expirare
router.get('/alerts', alimenteController.getAlerts);

module.exports = router;
