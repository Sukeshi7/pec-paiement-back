const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const merchant = await Merchant.findOne({ where: { appId: decoded.appId } });
    console.log('ehe', merchant);
    if (!merchant) {
      return res.status(403).json({ error: 'Marchand introuvable' });
    }

    req.user = merchant;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = authenticateToken;
