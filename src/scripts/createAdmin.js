require('dotenv').config();
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const { sequelize } = require('../db/sequelize');

async function createAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la BDD OK ✅');

    const email = 'admin@example.com';
    const password = 'admin123';

    const hashedPassword = await bcrypt.hash(password, 10);

    const [admin, created] = await Admin.findOrCreate({
      where: { email },
      defaults: { password: hashedPassword },
    });

    if (created) {
      console.log('Admin créé avec succès');
    } else {
      console.log('Admin déjà existant');
    }

    process.exit();
  } catch (err) {
    console.error('Erreur lors de la création de l\'admin :', err);
    process.exit(1);
  }
}

createAdmin();
