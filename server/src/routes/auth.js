// /**
//  * routes/auth.js
//  * Routes d'authentification (inscription / connexion).
//  * - Gère l'upload de photo de profil via multer
//  * - Valide et sanitize les champs d'inscription
//  */

// /** Multer est une bibliothèque middleware Node.js.
//  * Son rôle est de gérer les téléchargements de fichiers (ex: images, documents) envoyés via des formulaires web.
//  * Il s'intègre avec Express.js pour traiter les données multipart/form-data.
//  * En bref, Multer simplifie le traitement des fichiers sur le serveur, en les rendant accessibles dans l'objet request d'Express.
//  */

// import express from "express";
// import multer from "multer";
// import { body, validationResult } from "express-validator";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// // Nécessaire pour __dirname en ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Importation correcte : Utilisez des imports nommés pour accéder aux fonctions du contrôleur
// import { register, login } from "../controllers/user.controller.js";

// const router = express.Router();

// // Configuration de multer pour stocker les images côté serveur
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "..", "uploads"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
//   },
// });
// const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // limite 5MB

// const registerValidators = [
//   body("firstName").trim().isLength({ min: 1, max: 50 }).escape(),
//   body("lastName").trim().isLength({ min: 1, max: 50 }).escape(),
//   body("username")
//     .trim()
//     .isLength({ min: 3, max: 30 })
//     .matches(/^[a-zA-Z0-9_.-]+$/)
//     .withMessage("Nom d'utilisateur invalide"),
//   body("email").isEmail().normalizeEmail(),
//   body("password")
//     .isLength({ min: 8 })
//     .matches(/(?=.*[0-9])(?=.*[A-Za-z])/) // letters+numbers
//     .withMessage("Le mot de passe doit contenir des lettres et des chiffres"),
//   body("passwordConfirm").custom(
//     (value, { req }) => value === req.body.password
//   ),
//   body("agreeToTerms").equals("true"),
//   body("postalCode").optional().isLength({ max: 5 }).trim().escape(),
//   body("phone").optional().isLength({ max: 10 }).trim().escape(),
//   body("gender")
//     .optional()
//     .isIn(["female", "male", "other", ""])
//     .trim()
//     .escape(),
//   body("birthday")
//     .optional()
//     .isISO8601()
//     .toDate()
//     .custom((val) => {
//       const ageDifMs = Date.now() - val.getTime();
//       const ageDate = new Date(ageDifMs);
//       const age = Math.abs(ageDate.getUTCFullYear() - 1970);
//       if (age < 16) throw new Error("Vous devez avoir au moins 16 ans");
//       return true;
//     }),
// ];

// // POST /api/auth/register
// router.post(
//   "/register",
//   upload.single("profilePhoto"),
//   registerValidators,
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty())
//       return res
//         .status(400)
//         .json({ message: "La validation a échoué", errors: errors.array() });
//     return register(req, res);
//   }
// );

// router.post("/login", (req, res) => login(req, res));

// export default router;
