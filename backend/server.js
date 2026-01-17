/**
 * @fileoverview Server Express pentru aplicația GreenShelf - Anti-Risipă de Alimente
 * Backend RESTful modular cu Sequelize ORM și SQLite
 */

const express = require('express');
const cors = require('cors');

// Import configurări și modele
const sequelize = require('./models/index');
const Categorie = require('./models/Categorie');
const Utilizator = require('./models/Utilizator');
const Grup = require('./models/Grup');
const GrupMembru = require('./models/GrupMembru');
const GrupInvite = require('./models/GrupInvite');
const Aliment = require('./models/Aliment');
const AlimentGrup = require('./models/AlimentGrup');
const Claim = require('./models/Claim');

// Import rute
const routes = require('./routes/index');

const app = express();
// Render folosește process.env.PORT, local va merge pe 8080
const PORT = process.env.PORT || 8080;

// Middleware - Ordinea contează!
app.use(cors()); 
app.use(express.json());

// Definirea asociațiilor între modele
Utilizator.hasMany(GrupMembru, { foreignKey: 'utilizator_id' });
GrupMembru.belongsTo(Utilizator, { foreignKey: 'utilizator_id', as: 'utilizator' });

Grup.hasMany(GrupMembru, { foreignKey: 'grup_id' });
GrupMembru.belongsTo(Grup, { foreignKey: 'grup_id', as: 'grup' });

Grup.hasMany(GrupInvite, { foreignKey: 'grup_id' });
GrupInvite.belongsTo(Grup, { foreignKey: 'grup_id', as: 'grup' });

Grup.hasMany(AlimentGrup, { foreignKey: 'grup_id' });
AlimentGrup.belongsTo(Grup, { foreignKey: 'grup_id', as: 'grup' });

Aliment.belongsTo(Categorie, { foreignKey: 'categorie_id', as: 'categorie' });
Categorie.hasMany(Aliment, { foreignKey: 'categorie_id' });

Aliment.hasMany(AlimentGrup, { foreignKey: 'aliment_id' });
AlimentGrup.belongsTo(Aliment, { foreignKey: 'aliment_id', as: 'aliment' });

Aliment.hasMany(Claim, { foreignKey: 'aliment_id' });
Claim.belongsTo(Aliment, { foreignKey: 'aliment_id', as: 'aliment' });

Utilizator.hasMany(Claim, { foreignKey: 'utilizator_id' });
Claim.belongsTo(Utilizator, { foreignKey: 'utilizator_id', as: 'utilizator' });

// Folosirea rutelor
app.use('/', routes);

/**
 * Inițializează baza de date și pornește serverul
 */
const initDb = async () => {
  try {
    await sequelize.query('PRAGMA foreign_keys = OFF;');
    await sequelize.sync({ alter: true });
    await sequelize.query('PRAGMA foreign_keys = ON;');

    console.log('✅ Tabelele au fost sincronizate cu Sequelize ORM');

    const defaultCategories = ['Fructe', 'Legume', 'Conserve', 'Carne', 'Lactate'];
    for (const nume of defaultCategories) {
      await Categorie.findOrCreate({ where: { nume } });
    }
  } catch (err) {
    console.error('❌ Eroare la inițializarea bazei de date:', err);
  }
};

// Pornirea serverului
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serverul merge pe portul ${PORT}!`);
    console.log(`🔗 URL Live: https://proiecttw-d1fe.onrender.com`);
  });
});