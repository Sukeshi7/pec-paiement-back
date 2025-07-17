const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');

router.get('/dashboard', isAdmin, (req, res) => {
  res.json({ message: 'Bienvenue sur le dashboard admin', adminId: req.admin.adminId });
});

module.exports = router;
