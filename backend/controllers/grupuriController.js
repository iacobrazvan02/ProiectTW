/**
 * @fileoverview Controller pentru grupuri și membri
 * @module controllers/grupuriController
 */

const Grup = require('../models/Grup');
const GrupMembru = require('../models/GrupMembru');
const GrupInvite = require('../models/GrupInvite');
const Utilizator = require('../models/Utilizator');
const Aliment = require('../models/Aliment');
const AlimentGrup = require('../models/AlimentGrup');
const Categorie = require('../models/Categorie');

/**
 * Listează toate grupurile cu număr de membri
 */
const getGrupuri = async (req, res) => {
    try {
        const grupuri = await Grup.findAll({
            include: [{
                model: GrupMembru,
                attributes: ['id'],
            }],
            order: [['created_at', 'DESC']],
        });

        const result = grupuri.map(g => ({
            ...g.toJSON(),
            membri_count: g.GrupMembrus ? g.GrupMembrus.length : 0,
        }));

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare la grupuri');
    }
};

/**
 * Creează un grup nou
 */
const createGrup = async (req, res) => {
    try {
        const { nume, descriere } = req.body;
        const grup = await Grup.create({
            nume,
            descriere: descriere || null,
        });
        res.json(grup);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare creare grup');
    }
};

/**
 * Listează membrii unui grup
 */
const getMembri = async (req, res) => {
    try {
        const { id } = req.params;
        const membri = await GrupMembru.findAll({
            where: { grup_id: id },
            include: [{
                model: Utilizator,
                as: 'utilizator',
                attributes: ['id', 'nume', 'email'],
            }],
        });

        const result = membri.map(m => ({
            id: m.utilizator ? m.utilizator.id : null,
            nume: m.utilizator ? m.utilizator.nume : 'Necunoscut',
            email: m.utilizator ? m.utilizator.email : null,
            etichete: m.etichete,
        }));

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare listare membri');
    }
};

/**
 * Adaugă un membru la grup
 */
const addMembru = async (req, res) => {
    try {
        const { id } = req.params;
        let { utilizator_id, nume, email, etichete } = req.body;

        if (!utilizator_id) {
            if (!nume) return res.status(400).send('Lipsește utilizator sau nume');
            const utilizator = await Utilizator.create({ nume, email: email || null });
            utilizator_id = utilizator.id;
        }

        const membru = await GrupMembru.create({
            grup_id: id,
            utilizator_id,
            etichete: etichete || null,
        });

        res.json(membru);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare adaugare membru');
    }
};

/**
 * Actualizează etichetele unui membru
 */
const updateMembru = async (req, res) => {
    try {
        const { id, uid } = req.params;
        const { etichete } = req.body;

        await GrupMembru.update(
            { etichete: etichete || null },
            { where: { grup_id: id, utilizator_id: uid } }
        );

        const membru = await GrupMembru.findOne({
            where: { grup_id: id, utilizator_id: uid },
        });

        res.json(membru);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare actualizare membru');
    }
};

/**
 * Șterge un membru din grup
 */
const deleteMembru = async (req, res) => {
    try {
        const { id, uid } = req.params;

        const deleted = await GrupMembru.destroy({
            where: { grup_id: id, utilizator_id: uid },
        });

        if (deleted === 0) {
            return res.status(404).json({ error: 'Membrul nu a fost găsit' });
        }

        res.json({ success: true, message: 'Membru șters cu succes' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare ștergere membru');
    }
};

/**
 * Creează o invitație pentru grup
 */
const createInvite = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;
        const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

        const invite = await GrupInvite.create({
            grup_id: id,
            email: email || null,
            token,
        });

        const grup = await Grup.findByPk(id);
        const inviteLink = `http://localhost:3000/invite/${token}`;

        res.json({
            ...invite.toJSON(),
            grup_nume: grup ? grup.nume : null,
            invite_link: inviteLink,
        });
    } catch (err) {
        console.error(err.message);
        console.error('Eroare creare invite');
        res.status(500).send('Eroare creare invite');
    }
};

/**
 * Listează invitațiile unui grup
 */
const getInvites = async (req, res) => {
    try {
        const { id } = req.params;
        const invites = await GrupInvite.findAll({
            where: { grup_id: id },
            order: [['created_at', 'DESC']],
        });
        res.json(invites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare listare invitații');
    }
};

/**
 * Vizualizează alimentele via token de invitație
 */
const viewInvite = async (req, res) => {
    try {
        const { token } = req.params;

        const invite = await GrupInvite.findOne({ where: { token } });
        if (!invite) {
            return res.status(404).json({ error: 'Invitație invalidă sau expirată' });
        }

        const grup = await Grup.findByPk(invite.grup_id);
        if (!grup) {
            return res.status(404).json({ error: 'Grupul nu mai există' });
        }

        const alimenteGrup = await AlimentGrup.findAll({
            where: { grup_id: invite.grup_id },
            include: [{
                model: Aliment,
                as: 'aliment',
                include: [{
                    model: Categorie,
                    as: 'categorie',
                    attributes: ['id', 'nume'],
                }],
            }],
        });

        const alimente = alimenteGrup.map(ag => ({
            ...ag.aliment.toJSON(),
            categorie: ag.aliment.categorie ? ag.aliment.categorie.nume : null,
            shared_at: ag.shared_at,
        }));

        if (invite.status === 'pending') {
            invite.status = 'viewed';
            await invite.save();
        }

        res.json({
            grup: {
                id: grup.id,
                nume: grup.nume,
            },
            alimente,
            invite_status: invite.status,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare vizualizare invitație');
    }
};

/**
 * Acceptă o invitație
 */
const acceptInvite = async (req, res) => {
    try {
        const { token } = req.params;
        const { nume, email } = req.body;

        const invite = await GrupInvite.findOne({ where: { token } });
        if (!invite) {
            return res.status(404).json({ error: 'Invitație invalidă' });
        }

        if (invite.status === 'accepted') {
            return res.status(400).json({ error: 'Invitația a fost deja acceptată' });
        }

        let utilizator = await Utilizator.findOne({
            where: { email: email || invite.email },
        });

        if (!utilizator && nume) {
            utilizator = await Utilizator.create({
                nume,
                email: email || invite.email,
            });
        }

        if (utilizator) {
            const existaMembru = await GrupMembru.findOne({
                where: { grup_id: invite.grup_id, utilizator_id: utilizator.id },
            });

            if (!existaMembru) {
                await GrupMembru.create({
                    grup_id: invite.grup_id,
                    utilizator_id: utilizator.id,
                });
            }
        }

        invite.status = 'accepted';
        await invite.save();

        res.json({
            success: true,
            message: 'Ai fost adăugat în grup!',
            grup_id: invite.grup_id,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare acceptare invitație');
    }
};

/**
 * Partajează un aliment la un grup
 */
const shareAlimentToGrup = async (req, res) => {
    try {
        const { id } = req.params;
        const { grup_id } = req.body;

        const exist = await AlimentGrup.findOne({
            where: { aliment_id: id, grup_id },
        });

        if (exist) {
            return res.status(400).send('Deja partajat');
        }

        const ag = await AlimentGrup.create({
            aliment_id: id,
            grup_id,
        });

        res.json(ag);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare share');
    }
};

/**
 * Partajează o categorie întreagă la un grup
 */
const shareCategorieToGrup = async (req, res) => {
    try {
        const { categorie, grup_id } = req.body;

        let where = {};
        if (categorie) {
            const cat = await Categorie.findOne({
                where: { nume: categorie },
            });
            if (cat) {
                where.categorie_id = cat.id;
            }
        }

        const alimente = await Aliment.findAll({ where });
        let inserted = 0;

        for (const a of alimente) {
            const exist = await AlimentGrup.findOne({
                where: { aliment_id: a.id, grup_id },
            });
            if (!exist) {
                await AlimentGrup.create({ aliment_id: a.id, grup_id });
                inserted++;
            }
        }

        res.json({ inserted });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare share categorie');
    }
};

/**
 * Listează alimentele partajate în grup
 */
const getAlimenteGrup = async (req, res) => {
    try {
        const { id } = req.params;

        const shared = await AlimentGrup.findAll({
            where: { grup_id: id },
            include: [{
                model: Aliment,
                as: 'aliment',
                include: [{
                    model: Categorie,
                    as: 'categorie',
                    attributes: ['id', 'nume'],
                }],
            }],
        });

        const result = shared.map(s => ({
            ...s.aliment.toJSON(),
            categorie: s.aliment.categorie ? s.aliment.categorie.nume : null,
            shared_at: s.shared_at,
        }));

        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Eroare listare alimente grup');
    }
};

module.exports = {
    getGrupuri,
    createGrup,
    getMembri,
    addMembru,
    updateMembru,
    deleteMembru,
    createInvite,
    getInvites,
    viewInvite,
    acceptInvite,
    shareAlimentToGrup,
    shareCategorieToGrup,
    getAlimenteGrup,
};
