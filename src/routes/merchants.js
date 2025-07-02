const express = require('express');
const Merchant = require('../models/Merchant');

const router = express.Router();

router.post('/', async (req, res) => {
  const { companyName, email } = req.body;

  if (!companyName || !email) {
    return res.status(400).json({ error: 'le nom de la compagnie et l\'email sont requis.' });
  }

  const credentials = Merchant.generateCredentials();

  try {
    const newMerchant = await Merchant.create({
      companyName,
      email,
      appId: credentials.appId,
      appSecret: credentials.appSecret,
      isActive: true
    });

    res.status(201).json({
      message: 'Marchand créé avec succès',
      merchant: {
        id: newMerchant.id,
        companyName: newMerchant.companyName,
        email: newMerchant.email,
        appId: newMerchant.appId,
        appSecret: newMerchant.appSecret,
        isActive: newMerchant.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
