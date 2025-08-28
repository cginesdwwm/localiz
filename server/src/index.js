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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === "production" ? 100 : 1000, // Limit each IP
  message: {
    error: "Trop de requêtes, veuillez réessayer plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Specific rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes
  message: {
    error:
      "Trop de tentatives d'authentification, veuillez réessayer plus tard.",
  },
  skipSuccessfulRequests: true,
});

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

// --- Request Validation Middleware ---
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Echec de la validation",
      details: errors.array(),
    });
  }
  next();
};

// --- Routes with middleware ---

// Apply auth rate limiting to authentication routes
app.use("/auth", authLimiter);

// ID parameter validation for routes with IDs
const validateId = [
  param("id")
    .matches(/^[a-zA-Z0-9-_]{1,50}$/)
    .withMessage("Format d'ID invalide"),
  handleValidationErrors,
];

const validateUserId = [
  param("userId")
    .matches(/^[a-zA-Z0-9-_]{1,50}$/)
    .withMessage("Format d'ID utilisateur invalide"),
  handleValidationErrors,
];

// Apply validation to specific route patterns
app.use("/deals/:id", validateId);
app.use("/listings/:id", validateId);
app.use("/profile/:userId", validateUserId);

// Mount all routes
app.use("/", routes);

// --- Error Handling ---

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Page non trouvée",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Erreur serveur:", error);

  // CORS error
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      error: "CORS: Origine non autorisée",
    });
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message =
    NODE_ENV === "production" ? "Erreur interne du serveur" : error.message;

  res.status(statusCode).json({
    error: message,
    ...(NODE_ENV === "development" && { stack: error.stack }),
  });
});

// démarre le serveur et connecte la base de données
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
  connectDB();
});

// --- Server Startup ---
// const startServer = async () => {
//   try {
//     // Connect to database first
//     await connectDB();
//     console.log("Database connected successfully");

//     // Start server
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//       console.log(`📦 Environment: ${NODE_ENV}`);
//       console.log(`🌐 CORS origins: ${getAllowedOrigins().join(", ")}`);
//     });
//   } catch (error) {
//     console.error("Failed to start server:", error);
//     process.exit(1);
//   }
// };

// // Handle unhandled rejections
// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Rejection:", err);
//   process.exit(1);
// });

// // Handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
//   process.exit(1);
// });

// startServer();
