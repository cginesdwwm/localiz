/**
 * routes/auth.js
 * Routes d'authentification (inscription / connexion).
 * - Gère l'upload de photo de profil via multer
 * - Valide et sanitize les champs d'inscription
 */

/** Multer est une bibliothèque middleware Node.js.
 * Son rôle est de gérer les téléchargements de fichiers (ex: images, documents) envoyés via des formulaires web.
 * Il s'intègre avec Express.js pour traiter les données multipart/form-data.
 * En bref, Multer simplifie le traitement des fichiers sur le serveur, en les rendant accessibles dans l'objet request d'Express.
 */

import express from "express";
import multer from "multer";
import { body, validationResult } from "express-validator";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Nécessaire pour __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import controllers from "../controllers/user.controller.js";
// Assurez-vous d'ajouter .js à la fin des chemins de fichiers locaux pour les modules ES

const router = express.Router();

// Configuration de multer pour stocker les images côté serveur
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // limite 5MB

// POST /api/auth/register
// Reçoit multipart/form-data (fichier + champs) pour créer un compte
// validation middlewares used for registration
const registerValidators = [
  body("firstName").trim().isLength({ min: 1, max: 50 }).escape(),
  body("lastName").trim().isLength({ min: 1, max: 50 }).escape(),
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage("Nom d'utilisateur invalide"),
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .matches(/(?=.*[0-9])(?=.*[A-Za-z])/) // letters+numbers
    .withMessage("Le mot de passe doit contenir des lettres et des chiffres"),
  body("passwordConfirm").custom(
    (value, { req }) => value === req.body.password
  ),
  body("agreeToTerms").equals("true"),
  body("postalCode").optional().isLength({ max: 5 }).trim().escape(),
  body("phone").optional().isLength({ max: 10 }).trim().escape(),
  body("gender")
    .optional()
    .isIn(["female", "male", "other", ""])
    .trim()
    .escape(),
  body("birthday")
    .optional()
    .isISO8601()
    .toDate()
    .custom((val) => {
      const ageDifMs = Date.now() - val.getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 16) throw new Error("Vous devez avoir au moins 16 ans");
      return true;
    }),
];

// register route uses multer upload then calls controller.register
router.post(
  "/register",
  upload.single("profilePhoto"),
  registerValidators,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .json({ message: "La validation a échoué", errors: errors.array() });
    // delegate to controller
    return controllers.register(req, res);
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email/mot de passe incorrect" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "Email/mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login route delegates to controller
router.post("/login", (req, res) => controllers.login(req, res));

export default router;
