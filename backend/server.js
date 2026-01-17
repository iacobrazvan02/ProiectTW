/**
 * @fileoverview Server Express pentru aplicația GreenShelf - Anti-Risipă de Alimente
 * Backend RESTful modular cu Sequelize ORM și SQLite
 * @author GreenShelf Team
 * @version 3.0.0
 */

const express = require('express');
const cors = require('cors');

// Import configurări și modele
const sequelize = require('./models/index');
const Categorie = require('./models/Categorie');

// Import rute
const routes = require('./routes/index');

// Inițializare aplicație Express
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Definirea asociațiilor între modele
const Utilizator = require('./models/Utilizator');
const Grup = require('./models/Grup');
const GrupMembru = require('./models/GrupMembru');
const GrupInvite = require('./models/GrupInvite');
const Aliment = require('./models/Aliment');
const AlimentGrup = require('./models/AlimentGrup');
const Claim = require('./models/Claim');

// Asociații Utilizator
Utilizator.hasMany(GrupMembru, { foreignKey: 'utilizator_id' });
GrupMembru.belongsTo(Utilizator, { foreignKey: 'utilizator_id', as: 'utilizator' });

// Asociații Grup
Grup.hasMany(GrupMembru, { foreignKey: 'grup_id' });
GrupMembru.belongsTo(Grup, { foreignKey: 'grup_id', as: 'grup' });

Grup.hasMany(GrupInvite, { foreignKey: 'grup_id' });
GrupInvite.belongsTo(Grup, { foreignKey: 'grup_id', as: 'grup' });

Grup.hasMany(AlimentGrup, { foreignKey: 'grup_id' });
AlimentGrup.belongsTo(Grup, { foreignKey: 'grup_id', as: 'grup' });

// Asociații Aliment
Aliment.belongsTo(Categorie, { foreignKey: 'categorie_id', as: 'categorie' });
Categorie.hasMany(Aliment, { foreignKey: 'categorie_id' });

Aliment.hasMany(AlimentGrup, { foreignKey: 'aliment_id' });
AlimentGrup.belongsTo(Aliment, { foreignKey: 'aliment_id', as: 'aliment' });

Aliment.hasMany(Claim, { foreignKey: 'aliment_id' });
Claim.belongsTo(Aliment, { foreignKey: 'aliment_id', as: 'aliment' });

Utilizator.hasMany(Claim, { foreignKey: 'utilizator_id' });
Claim.belongsTo(Utilizator, { foreignKey: 'utilizator_id', as: 'utilizator' });

// Folosirea rutelor
// Folosirea rutelor
app.use('/', routes);

// Servește fișierele statice din frontend (pentru producție)
const path = require('path');
const frontendPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendPath));

// Orice altă rută returnează index.html (pentru React Router)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

/**
 * Inițializează baza de date și pornește serverul
 */
const initDb = async () => {
  try {
    // Dezactivează verificarea cheilor străine pentru a permite modificări de structură
    await sequelize.query('PRAGMA foreign_keys = OFF;');

    await sequelize.sync({ alter: true });

    // Reactivează verificarea cheilor străine
    await sequelize.query('PRAGMA foreign_keys = ON;');

    console.log('Tabelele au fost sincronizate cu Sequelize ORM');

    // Creează categorii implicite dacă nu există
    const defaultCategories = ['Fructe', 'Legume', 'Conserve', 'Carne', 'Lactate'];
    for (const nume of defaultCategories) {
      await Categorie.findOrCreate({ where: { nume } });
    }
  } catch (err) {
    console.error('Eroare la inițializarea bazei de date:', err);
  }
};

// Pornirea serverului
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serverul merge pe http://localhost:${PORT} și folosește Sequelize ORM cu SQLite!`);
    console.log('📁 Structură modulară: routes/ + controllers/ + models/');
  });
});