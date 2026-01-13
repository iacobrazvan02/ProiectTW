/**
 * @fileoverview Rute pentru grupuri
 * @module routes/grupuriRoutes
 */

const express = require('express');
const router = express.Router();
const grupuriController = require('../controllers/grupuriController');

// GET /grupuri - Listează grupurile
router.get('/', grupuriController.getGrupuri);

// POST /grupuri - Creează grup
router.post('/', grupuriController.createGrup);

// GET /grupuri/:id/membri - Listează membri
router.get('/:id/membri', grupuriController.getMembri);

// POST /grupuri/:id/membri - Adaugă membru
router.post('/:id/membri', grupuriController.addMembru);

// PUT /grupuri/:id/membri/:uid - Actualizează membru
router.put('/:id/membri/:uid', grupuriController.updateMembru);

// DELETE /grupuri/:id/membri/:uid - Șterge membru
router.delete('/:id/membri/:uid', grupuriController.deleteMembru);

// POST /grupuri/:id/invite - Creează invitație
router.post('/:id/invite', grupuriController.createInvite);

// GET /grupuri/:id/invites - Listează invitații
router.get('/:id/invites', grupuriController.getInvites);

// GET /grupuri/:id/alimente - Listează alimentele partajate
router.get('/:id/alimente', grupuriController.getAlimenteGrup);

module.exports = router;
