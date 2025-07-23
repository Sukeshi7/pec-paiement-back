const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Merchant = require('../models/Merchant');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password, appId, appSecret } = req.body;

  try {
    let merchant = null;

    if (email && password) {
      merchant = await Merchant.findOne({ where: { contactEmail: email, isActive: true } });

      if (!merchant || !merchant.password || !(await bcrypt.compare(password, merchant.password))) {
        return res.status(401).json({ error: 'Email ou mot de passe invalide.' });
      }

    } else if (appId && appSecret) {
      merchant = await Merchant.findOne({ where: { appId, appSecret, isActive: true } });

      if (!merchant) {
        return res.status(401).json({ error: 'Identifiants API invalides.' });
      }

    } else {
      return res.status(400).json({ error: 'Fournir soit email+password, soit appId+appSecret.' });
    }

    const token = jwt.sign(
      {
        merchantId: merchant.id,
        companyName: merchant.companyName,
        email: merchant.contactEmail
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
