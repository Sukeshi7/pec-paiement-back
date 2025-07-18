const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Operation = require('../models/Operation');

router.get('/:id/operations', async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id, {
      include: [Operation],
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction introuvable' });
    }

    res.json({
      transactionId: transaction.id,
      operations: transaction.Operations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des opérations' });
  }
});

router.post('/:id/refund', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const transaction = await Transaction.findByPk(id, {
      include: [Operation],
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction introuvable' });
    }

    if (transaction.status !== 'success') {
      return res.status(400).json({ error: 'La transaction n\'est pas payée, remboursement impossible.' });
    }

    const totalCaptured = transaction.Operations
      .filter(op => op.type === 'capture')
      .reduce((sum, op) => sum + op.amount, 0);

    const totalRefunded = transaction.Operations
      .filter(op => op.type === 'refund')
      .reduce((sum, op) => sum + op.amount, 0);

    const remainingRefundable = totalCaptured - totalRefunded;

    if (amount > remainingRefundable) {
      return res.status(400).json({
        error: `Montant trop élevé. Il reste seulement ${remainingRefundable} à rembourser.`,
      });
    }

    await Operation.create({
      transactionId: transaction.id,
      type: 'refund',
      amount,
      status: 'done',
    });

    if (amount === remainingRefundable) {
      transaction.status = 'refunded';
      await transaction.save();
    }

    res.json({ message: 'Remboursement effectué avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du remboursement' });
  }
});


module.exports = router;
