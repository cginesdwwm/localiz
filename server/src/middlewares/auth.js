/**
 * middleware/auth.js
 * Middleware pour vérifier la présence et la validité d'un token JWT.
 */

import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const header = req.headers.authorization;
  if (!header)
    return res
      .status(401)
      .json({ message: "Le token d'autorisation est manquant" });
  const parts = header.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ message: "En-tête d'autorisation invalide" });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.userId = decoded.id; // l'ID utilisateur est disponible pour les routes protégées
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}
