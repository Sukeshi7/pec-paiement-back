const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Operation = require('../models/Operation');


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    return res.status(404).send('Transaction introuvable');
  }

 res.json({ transaction });
});

router.post('/:id/confirm', async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    return res.status(404).send('Transaction introuvable');
  }

  transaction.status = 'confirmed';
  await transaction.save();

  await Operation.create({
  type: 'capture',
  amount: transaction.amount,
  transactionId: transaction.id,
  status: 'done',
});
  res.redirect(transaction.redirectSuccessUrl);
});

router.post('/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    return res.status(404).send('Transaction introuvable');
  }

  transaction.status = 'cancelled';
  await transaction.save();

  res.redirect(transaction.redirectCancelUrl);
});

module.exports = router;
