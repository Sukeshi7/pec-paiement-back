const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token manquant.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.role);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Accès interdit.' });

    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide.', details: err.message });
  }
};
