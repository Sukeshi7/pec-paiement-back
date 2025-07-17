const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const Merchant = require('../models/Merchant');
const Transaction = require('../models/Transaction');

router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const merchants = await Merchant.count();
    const transactions = await Transaction.findAll();

    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    res.json({
      merchants,
      transactions: transactions.length,
      totalAmount
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
