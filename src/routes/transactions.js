const express = require('express');
const router = express.Router();
const Transaction  = require('../models/Transaction');
const authenticateToken  = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const merchant = req.user;

    const { amount, currency, redirectSuccessUrl, redirectCancelUrl } = req.body;

    const transaction = await Transaction.create({
      amount,
      currency,
      merchantId: merchant.id,
      redirectSuccessUrl,
      redirectCancelUrl,
      status: 'pending',
    });

    const paymentUrl = `http://localhost:3000/payment/${transaction.id}`;
    transaction.paymentUrl = paymentUrl;
    await transaction.save();

    res.status(201).json({
      message: 'Transaction créée avec succès',
      transactionId: transaction.id,
      paymentUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la transaction' });
  }
});

module.exports = router;
