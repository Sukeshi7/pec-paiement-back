const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    return res.status(404).send('Transaction introuvable');
  }

  res.send(`
    <html>
      <head><title>Paiement</title></head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px">
        <h1>Paiement de ${transaction.amount} ${transaction.currency}</h1>
        <p>Transaction ID : ${transaction.id}</p>
        <form method="POST" action="/payment/${transaction.id}/confirm">
          <button type="submit">✅ Confirmer le paiement</button>
        </form>
        <br>
        <form method="POST" action="/payment/${transaction.id}/cancel">
          <button type="submit">❌ Annuler le paiement</button>
        </form>
      </body>
    </html>
  `);
});

router.post('/:id/confirm', async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    return res.status(404).send('Transaction introuvable');
  }

  transaction.status = 'processing';
  await transaction.save();
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
