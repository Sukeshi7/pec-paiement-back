const jwt = require("jsonwebtoken");
const Merchant = require("../models/Merchant");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded);
    const merchant = await Merchant.findOne({
      where: { id: decoded.merchantId },
    });

    if (!merchant) {
      return res.status(403).json({ error: "Marchand introuvable" });
    }

    if (!merchant.isActive) {
      return res
        .status(403)
        .json({
          error:
            "Compte non activé. Veuillez activer votre compte via l’email reçu.",
        });
    }

    req.user = { merchantId: merchant.id };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token invalide ou expiré" });
  }
};

module.exports = authenticateToken;
