/*
	server/src/routes/index.js
	- Ce fichier est le point d'entrée pour toutes les routes de l'API.
	- Il monte chaque routeur sur le chemin approprié (ex: /api/auth, /api/users).
*/

import express from "express";

import userRoutes from "./user.route.js";
import blogRoutes from "./blog.route.js";

const router = express.Router();

router.use("/blog", blogRoutes);
router.use("/user", userRoutes);

export default router;

// http://localhost:5000

// import express from "express";

// // Importez le routeur d'authentification (auth.js)
// import authRoutes from "./auth.js";
// // Importez le routeur pour les opérations utilisateur protégées (users.js)
// import userRoutes from "./user.route.js";

// const router = express.Router();

// // Montez les routes d'authentification sur le chemin '/auth'
// // Les routes de auth.js seront accessibles via /api/auth/...

// // Montez les routes utilisateurs sur le chemin '/users'
// // Les routes de users.js seront accessibles via /api/users/me
// router.use("/users", userRoutes);

// export default router;

// // http://localhost:5000
