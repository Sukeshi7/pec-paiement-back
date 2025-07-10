const express = require('express');
const validator = require('validator');
const Merchant = require('../models/Merchant');

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    companyName,
    contactEmail,
    Kbis,
    contactName,
    contactPhone,
    redirectSuccessUrl,
    redirectCancelUrl,
    currency
  } = req.body;

  if (!companyName || !contactEmail || !Kbis || !contactName || !contactPhone || !redirectSuccessUrl || !redirectCancelUrl || !currency) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  if (!validator.isEmail(contactEmail)) {
    return res.status(400).json({ error: 'Email invalide.' });
  }

  if (!validator.isMobilePhone(contactPhone, 'fr-FR')) {
    return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
  }

  if (!validator.isURL(redirectSuccessUrl) || !validator.isURL(redirectCancelUrl)) {
    return res.status(400).json({ error: 'URL de redirection invalide.' });
  }

  const supportedCurrencies = ['EUR', 'USD', 'GBP'];
  if (!supportedCurrencies.includes(currency)) {
    return res.status(400).json({ error: `Devise non supportée. Choisissez parmi : ${supportedCurrencies.join(', ')}` });
  }

  const credentials = Merchant.generateCredentials();

  try {
    const newMerchant = await Merchant.create({
      companyName,
      Kbis,
      contactEmail,
      contactName,
      contactPhone,
      redirectUrlSuccess: redirectSuccessUrl,
      redirectUrlCancel: redirectCancelUrl,
      currency,
      appId: credentials.appId,
      appSecret: credentials.appSecret,
      isActive: true,
    });

    res.status(201).json({
      message: 'Marchand créé avec succès',
      merchant: {
        id: newMerchant.id,
        companyName: newMerchant.companyName,
        contactEmail: newMerchant.contactEmail,
        appId: newMerchant.appId,
        appSecret: newMerchant.appSecret,
        isActive: newMerchant.isActive
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

const verifyToken = require('../middleware/verifyToken');

router.get('/me', verifyToken, async (req, res) => {
  try {
    const merchant = await Merchant.findByPk(req.merchant.merchantId, {
      attributes: { exclude: ['appSecret'] },
    });

    if (!merchant) {
      return res.status(404).json({ error: 'Marchand introuvable' });
    }

    res.json({ merchant });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

const authMiddleware = require('../middleware/auth');

router.post('/regenerate-credentials', authMiddleware, async (req, res) => {
  const merchantId = req.user.merchantId;

  try {
    const merchant = await Merchant.findByPk(merchantId);

    if (!merchant) {
      console.log(merchant);
      return res.status(404).json({ error: 'Marchand introuvable.' });
    }

    const newSecret = Merchant.generateCredentials().appSecret;

    merchant.appSecret = newSecret;
    await merchant.save();

    res.json({
      message: 'Nouveau APP_SECRET généré avec succès.',
      appSecret: newSecret
    });

  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});


module.exports = router;
