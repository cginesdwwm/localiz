/*
	user.route.js
	- Définit les routes relatives aux utilisateurs.
	- Chemin final (si ce routeur est monté sur '/user'):
		- POST /user       -> register
		- POST /user/login -> login
*/

import express from "express";
import { login, register } from "../controllers/user.controller.js";

const router = express.Router();

// Inscription
router.post("/register", register);

// Connexion
router.post("/login", login);

export default router;

// Exemple d'URL pour tester: http://localhost:5000/user
