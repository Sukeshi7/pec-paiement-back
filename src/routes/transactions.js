const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction  = require('../models/Transaction');
const Operation = require('../models/Operation');
const authenticateToken  = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const merchant = req.user;

    const {
      amount,
      currency,
      redirectSuccessUrl,
      redirectCancelUrl,
      callbackUrl,
      customer,       
      metadata         
    } = req.body;

    const transaction = await Transaction.create({
      amount,
      currency,
      merchantId: merchant.merchantId,
      redirectSuccessUrl,
      redirectCancelUrl,
      callbackUrl,
      status: 'created',
      customerName: customer?.name || null,
      customerEmail: customer?.email || null,
      customerAddress: customer?.address || null,


      items: metadata?.items || null
    });

    const paymentUrl = `http://localhost:5173/payment/${transaction.id}`;
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

router.post('/notify/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction introuvable' });
    }

    transaction.status = 'success';
    await transaction.save();

    if (transaction.callbackUrl) {
      try {
        await axios.post(transaction.callbackUrl, {
          transactionId: transaction.id,
          status: transaction.status,
          amount: transaction.amount,
          currency: transaction.currency,
        });

        console.log('Webhook envoyé au marchand');
      } catch (err) {
        console.error('Erreur webhook marchand :', err.message);
      }
    }

    res.json({ message: 'Paiement confirmé et webhook envoyé si défini.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la notification' });
  }
});
router.get('/merchant', authenticateToken, async (req, res) => {
  const transactions = await Transaction.findAll({
    where: { merchantId: req.user.merchantId },
    include: [Operation],
    order: [['createdAt', 'DESC']],
  })
  res.json({ transactions })
})

router.post('/pay/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { card } = req.body 

  try {
    const transaction = await Transaction.findByPk(id)

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction introuvable' })
    }

    if (transaction.status !== 'created') {
      return res.status(400).json({ error: 'Transaction déjà traitée ou invalide' })
    }

    transaction.status = 'pending'
    await transaction.save()

    await axios.post('http://localhost:4000/psp/pay', {
      transactionId: transaction.id,
      amount: transaction.amount,
      callbackUrl: 'http://localhost:3000/callback',
      card 
    })

    console.log(`[BACKEND] Paiement lancé pour transaction ${transaction.id} (pending)`)

    res.json({ message: 'Paiement lancé via le PSP mock.' })
  } catch (err) {
    console.error('[BACKEND] Erreur PSP mock :', err.message)
    res.status(500).json({ error: 'Erreur lors de l’appel au PSP mock' })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const transaction = await Transaction.findByPk(id)

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction introuvable' })
    }

    res.json({
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      redirectSuccessUrl: transaction.redirectSuccessUrl,
      redirectCancelUrl: transaction.redirectCancelUrl
    })
  } catch (err) {
    console.error('Erreur lors de la récupération de la transaction :', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})


module.exports = router;
