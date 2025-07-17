const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email et mot de passe requis.' });

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) return res.status(404).json({ error: 'Admin introuvable.' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect.' });

    const token = jwt.sign(
      { adminId: admin.id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, message: 'Connexion réussie' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
