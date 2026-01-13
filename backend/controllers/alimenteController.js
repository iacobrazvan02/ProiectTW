/**
 * @fileoverview Controller pentru alimente
 * Conține logica de business pentru gestionarea alimentelor
 * @module controllers/alimenteController
 */

const { Op } = require('sequelize');
const Aliment = require('../models/Aliment');
const Categorie = require('../models/Categorie');
const Claim = require('../models/Claim');

/**
 * Listează toate alimentele
 */
const getAlimente = async (req, res) => {
    try {
        const alimente = await Aliment.findAll({
            where: {
                [Op.or]: [
                    { cantitate_nr: { [Op.gt]: 0 } },
                    { cantitate_nr: null }
                ]
            },
            include: [{
                model: Categorie,
                as: 'categorie',
                attributes: ['id', 'nume'],
            }],
            order: [['created_at', 'DESC']],
        });

        const result = alimente.map(a => ({
            ...a.toJSON(),
            categorie: a.categorie ? a.categorie.nume : null,
        }));

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la alimente');
    }
};

/**
 * Adaugă un aliment nou
 */
const addAliment = async (req, res) => {
    try {
        const { nume, descriere, categorie, cantitate_nr, pret_per_kg, data_expirare } = req.body;
        console.log('POST /adauga body:', req.body);

        let categorie_id = null;
        if (categorie && categorie.trim() !== '') {
            const normalized = categorie.trim();
            let cat = await Categorie.findOne({
                where: { nume: { [Op.like]: normalized } },
            });
            if (!cat) {
                cat = await Categorie.create({ nume: normalized });
            }
            categorie_id = cat.id;
        }

        const aliment = await Aliment.create({
            nume,
            descriere: descriere || null,
            categorie_id,
            cantitate_nr: cantitate_nr || null,
            pret_per_kg: pret_per_kg || null,
            data_expirare: data_expirare || null,
        });

        const result = await Aliment.findByPk(aliment.id, {
            include: [{ model: Categorie, as: 'categorie', attributes: ['id', 'nume'] }],
        });

        res.json({
            ...result.toJSON(),
            categorie: result.categorie ? result.categorie.nume : null,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la adăugare');
    }
};

/**
 * Toggle sau setează starea de disponibilitate
 */
const toggleOfera = async (req, res) => {
    try {
        const { id } = req.params;
        const { disponibil, descriere } = req.body || {};

        const aliment = await Aliment.findByPk(id);
        if (!aliment) return res.status(404).send('Alimentul nu a fost găsit');

        if (typeof disponibil === 'undefined') {
            aliment.disponibil = !aliment.disponibil;
        } else {
            aliment.disponibil = disponibil;
            if (typeof descriere !== 'undefined') {
                aliment.descriere = descriere;
            } else if (disponibil === false) {
                // Dacă oferta este retrasă și nu s-a trimis o descriere,
                // curățăm detaliile ofertei și prețul afișat.
                aliment.descriere = null;
                aliment.pret_per_kg = null;
            }
        }

        await aliment.save();

        const updatedAliment = await Aliment.findByPk(id, {
            include: [{
                model: Categorie,
                as: 'categorie',
                attributes: ['id', 'nume'],
            }],
        });

        const result = {
            ...updatedAliment.toJSON(),
            categorie: updatedAliment.categorie ? updatedAliment.categorie.nume : null,
        };

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la actualizarea statusului');
    }
};

/**
 * Revendică un produs disponibil
 */
const claimAliment = async (req, res) => {
    try {
        const { id } = req.params;
        const { utilizator_id, amount } = req.body;

        const aliment = await Aliment.findByPk(id);
        if (!aliment) return res.status(404).send('Alimentul nu a fost găsit');

        if (typeof amount !== 'undefined' && aliment.cantitate_nr !== null) {
            const curVal = parseFloat(aliment.cantitate_nr) || 0;
            const amountNum = parseFloat(amount);
            const newVal = Math.max(0, curVal - amountNum);

            aliment.cantitate_nr = newVal;
            aliment.disponibil = newVal > 0;
        } else {
            aliment.claimed_by = utilizator_id || null;
            aliment.disponibil = false;
        }

        await aliment.save();

        const claim = await Claim.create({
            aliment_id: id,
            utilizator_id: utilizator_id || null,
        });

        const updatedAliment = await Aliment.findByPk(id, {
            include: [{
                model: Categorie,
                as: 'categorie',
                attributes: ['id', 'nume'],
            }],
        });

        const result = {
            ...updatedAliment.toJSON(),
            categorie: updatedAliment.categorie ? updatedAliment.categorie.nume : null,
        };

        res.json({ succes: true, claim, updated: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la claim');
    }
};

/**
 * Anulează ultimul claim
 */
const undoClaim = async (req, res) => {
    try {
        const { id } = req.params;

        const lastClaim = await Claim.findOne({
            where: { aliment_id: id },
            order: [['data_claim', 'DESC']],
        });

        if (!lastClaim) {
            return res.status(404).json({ error: 'Nu există claim-uri pentru acest produs' });
        }

        const aliment = await Aliment.findByPk(id);
        if (!aliment) {
            return res.status(404).send('Alimentul nu a fost găsit');
        }

        const currentQty = parseFloat(aliment.cantitate_nr) || 0;
        const restoreAmount = parseFloat(req.body.amount) || 1;

        aliment.cantitate_nr = currentQty + restoreAmount;
        aliment.disponibil = true;
        await aliment.save();

        await lastClaim.destroy();

        const updatedAliment = await Aliment.findByPk(id, {
            include: [{
                model: Categorie,
                as: 'categorie',
                attributes: ['id', 'nume'],
            }],
        });

        const result = {
            ...updatedAliment.toJSON(),
            categorie: updatedAliment.categorie ? updatedAliment.categorie.nume : null,
        };

        res.json({ succes: true, restored: restoreAmount, updated: result });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la anulare claim');
    }
};

/**
 * Șterge un aliment și toate asocierile sale
 */
const deleteAliment = async (req, res) => {
    try {
        const { id } = req.params;
        const aliment = await Aliment.findByPk(id);
        if (!aliment) return res.status(404).send('Nu există');

        // Șterge asocieri manual pentru a evita erori de Foreign Key
        // Notă: Import AlimentGrup la începutul fișierului dacă nu există
        const AlimentGrup = require('../models/AlimentGrup');
        await AlimentGrup.destroy({ where: { aliment_id: id } });
        await Claim.destroy({ where: { aliment_id: id } });

        await aliment.destroy();
        res.json({ succes: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la ștergere: ' + err.message);
    }
};

/**
 * Listează alerte pentru produse care expiră curând
 */
const getAlerts = async (req, res) => {
    try {
        const zile = parseInt(req.query.zile) || 7;
        const azi = new Date();
        const limita = new Date(azi.getTime() + zile * 24 * 60 * 60 * 1000);

        const alimente = await Aliment.findAll({
            where: {
                data_expirare: {
                    [Op.between]: [azi, limita],
                },
                [Op.or]: [
                    { cantitate_nr: { [Op.gt]: 0 } },
                    { cantitate_nr: null },
                ],
            },
            order: [['data_expirare', 'ASC']],
        });

        res.json(alimente);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la alerts');
    }
};

module.exports = {
    getAlimente,
    addAliment,
    toggleOfera,
    claimAliment,
    undoClaim,
    deleteAliment,
    getAlerts,
};
