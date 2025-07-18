const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('../models/Transaction');

router.post('/webhook', async (req, res) => {
  const { transactionId, status } = req.body;

  try {
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction introuvable' });
    }

    transaction.status = status;
    await transaction.save();

    if (transaction.callbackUrl) {
      await axios.post(transaction.callbackUrl, {
        transactionId: transaction.id,
        amount: transaction.amount,
        status: transaction.status,
        currency: transaction.currency,
      });
    }

    res.status(200).json({ message: 'Notification traitée et webhook envoyé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du traitement PSP.' });
  }
});

module.exports = router;
