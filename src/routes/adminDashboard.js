const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const Merchant = require('../models/Merchant');
const Transaction = require('../models/Transaction');

router.get('/stats', isAdmin, async (req, res) => {
  try {
    const merchants = await Merchant.count();
    const transactions = await Transaction.findAll({
      include: ['Operations']
    });

    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const successCount = transactions.filter(tx => tx.status === 'success').length;
    const successRate = transactions.length > 0
      ? ((successCount / transactions.length) * 100).toFixed(2)
      : 0;

    let totalCaptured = 0;
    let totalRefunded = 0;

    transactions.forEach(tx => {
      tx.Operations?.forEach(op => {
        if (op.type === 'capture') totalCaptured += op.amount;
        if (op.type === 'refund') totalRefunded += op.amount;
      });
    });

    res.json({
      merchants,
      transactions: transactions.length,
      totalAmount,
      successCount,
      successRate: parseFloat(successRate),
      totalCaptured,
      totalRefunded
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});


router.get('/merchants', isAdmin, async (req, res) => {
  try {
    const merchants = await Merchant.findAll();
    res.json({ merchants });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des marchands', details: err.message });
  }
});

router.get('/transactions', isAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{ model: Merchant }]
    });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des transactions', details: err.message });
  }
});
module.exports = router;
