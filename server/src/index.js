/*
  server/src/index.js
  - Point d'entrée du serveur Express.
  - Rôle principal : configurer les middlewares, le CORS, connecter la DB
    et monter les routes.

  Concepts clés pour débutant :
  - dotenv : charge les variables d'environnement depuis un fichier .env
  - express.json() : permet à Express de parser le corps JSON des requêtes
  - cookieParser : lit les cookies (utile pour l'authentification via cookies)
  - CORS : règle qui autorise le navigateur à appeler le backend depuis une origine différente
*/

// framework utilisé par le serveur node
import express from "express";

// permet de lire les variables d'environnement contenues dans .env
import dotenv from "dotenv";

// permet de lire le contenu des cookies
import cookieParser from "cookie-parser";

import cors from "cors";

// permet de préciser où sont les routes (index des routes)
import routes from "./routes/index.js";

// récupère la connexion à la base de données
import { connectDB } from "./lib/db.js";

import helmet from "helmet"; // Security headers
import rateLimit from "express-rate-limit"; // Rate limiting
import { body, param, validationResult } from "express-validator"; // Input validation

// indique que l'on va utiliser .env (charge process.env)
dotenv.config();

const PORT = process.env.PORT || 5000; // valeur par défaut si non définie

// crée l'app Express
const app = express();

// --- Security Middleware ---

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false, // Adjust based on your needs
  })
);

// middlewares globaux
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configuration CORS : autorise le front (localhost:5173) à appeler le backend
app.use(
  cors({
    origin: "http://localhost:5173",
    // ou "*" pour autoriser toutes les origines (moins sécurisé en prod)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

// Mount all routes
app.use("/api", routes);

// --- Error Handling ---

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Page non trouvée",
    path: req.originalUrl,
  });
});

// démarre le serveur et connecte la base de données
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
  connectDB();
});
