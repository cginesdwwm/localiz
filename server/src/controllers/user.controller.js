/*
    Points importants pour débutant :
  - Ne jamais stocker un mot de passe en clair : on utilise bcrypt.hash avant de sauvegarder.
  - Pour la connexion, on compare le mot de passe reçu avec bcrypt.compare.
  - Les contrôleurs renvoient des codes HTTP appropriés (200 pour succès, 400 pour erreur client).
*/

// controllers/user.controller.js
import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Inscription
 */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      postalCode,
      birthday,
      gender,
      agreeToTerms,
      password,
    } = req.body;

    // Vérifier champs obligatoires
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    // Vérifier si email/username/phone existent déjà
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "Email déjà utilisé" });

    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return res
        .status(400)
        .json({ message: "Nom d'utilisateur déjà utilisé" });

    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists)
        return res.status(400).json({ message: "Téléphone déjà utilisé" });
    }

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // // Photo si envoyée via multer
    // const profilePhotoPath = req.file
    //   ? `/uploads/${req.file.filename}`
    //   : undefined;

    // Création nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      postalCode,
      birthday: birthday ? new Date(birthday) : undefined,
      gender,
      agreeToTerms: !!agreeToTerms,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        postalCode: newUser.postalCode,
        birthday: newUser.birthday,
        gender: newUser.gender,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * Connexion
 */
export const login = async (req, res) => {
  try {
    const { data, email, username, password } = req.body;

    const identifier = data || email || username;
    if (!identifier || !password)
      return res.status(400).json({ message: "Données manquantes" });

    // Détection email ou username
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let user;
    if (emailRegex.test(identifier)) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user)
      return res.status(400).json({ message: "Identifiants invalides" });

    // Vérification mot de passe
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Identifiants invalides" });

    // Génération JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    // On ne renvoie pas le mot de passe.
    // publicUser est une version "nettoyée" de l’utilisateur, sans mot de passe ni infos sensibles, spécialement faite pour être envoyée côté client.
    const publicUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      postalCode: user.postalCode,
      birthday: user.birthday,
      gender: user.gender,
    };

    return res.json({ token, user: publicUser, message: "Connexion réussie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
