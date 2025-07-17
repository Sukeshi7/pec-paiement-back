const mongoose = require('mongoose');
require('dotenv').config();
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connexion réussie à MongoDB');
  } catch (error) {
    console.error('Erreur connexion MongoDB:', error);
  }
};

module.exports = connectMongo;
