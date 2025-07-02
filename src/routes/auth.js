const express = require('express');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');

const router = express.Router();

router.post('/token', async (req, res) => {
  const { appId, appSecret } = req.body;

  if (!appId || !appSecret) {
    return res.status(400).json({ error: 'appId et appSecret sont requis.' });
  }

  try {
    const merchant = await Merchant.findOne({
      where: { appId, appSecret, isActive: true }
    });

    if (!merchant) {
      return res.status(401).json({ error: 'Identifiants invalides ou compte inactif.' });
    }

    const token = jwt.sign(
      {
        merchantId: merchant.id,
        companyName: merchant.companyName,
        email: merchant.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
