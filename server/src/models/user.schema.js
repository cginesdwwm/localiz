/**
 * Schéma Mongoose pour les utilisateurs.
 * Contient les informations collectées à l'inscription.
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    postalCode: { type: String, required: true },
    birthday: { type: Date, required: true },
    gender: { type: String, required: true },
    // profilePhoto: { type: String, required: true },
    agreeToTerms: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
  }
);

const User = mongoose.model("User", userSchema);

export default User;
