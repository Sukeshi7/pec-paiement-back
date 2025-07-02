const mongoose = require('mongoose');
require('dotenv').config();

process.env.MONGO_URI="mongodb://localhost:27017/payment_logs"
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('connexion réussie à MongoDB');
  } catch (error) {
    console.error('Erreur connexion MongoDB:', error);
  }
};

module.exports = connectMongo;
