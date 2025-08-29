// /**
//  * routes/users.js
//  * Routes liées aux opérations utilisateur protégées.
//  */

// import express from "express";
// import User from "../models/user.schema.js"; // Assurez-vous d'ajouter .js à la fin
// import auth from "../middlewares/auth.js"; // Assurez-vous d'ajouter .js à la fin

// const router = express.Router();

// // GET /api/users/me - retourne le profil de l'utilisateur authentifié
// router.get("/me", auth, async (req, res) => {
//   try {
//     // exclut le mot de passe et la version
//     const user = await User.findById(req.userId).select("-password -__v");
//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }
//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Changez la ligne d'exportation par défaut
// export const userRoutes = router;
