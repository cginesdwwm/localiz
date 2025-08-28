/*
  db.js
  - Fichier responsable de la connexion à MongoDB via mongoose.
  - Exporte une fonction `connectDB` qui essaie de se connecter à l'URI
    fourni dans les variables d'environnement (process.env.MONGO_URI).
*/

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // mongoose.connect retourne une promesse qui résout la connexion
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected : ${connect.connection.host}`);
  } catch (error) {
    // En cas d'erreur, on loggue l'erreur. En prod on pourrait aussi retry.
    console.log("MongoDB connection error", error);
  }
};
