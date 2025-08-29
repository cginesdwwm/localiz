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
 * REGISTER
 * Création d'un nouvel utilisateur
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

    // Vérif champs requis
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    // Vérif doublons
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
        return res
          .status(400)
          .json({ message: "Numéro de téléphone déjà utilisé" });
    }

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Photo si envoyée via multer
    const profilePhotoPath = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      phone,
      postalCode,
      birthday: birthday ? new Date(birthday) : undefined,
      gender,
      profilePhoto: profilePhotoPath,
      agreeToTerms: !!(agreeToTerms === "true" || agreeToTerms === true),
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        profilePhoto: newUser.profilePhoto,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

/**
 * LOGIN
 * Connexion utilisateur avec email ou username
 */
export const login = async (req, res) => {
  try {
    const { data, email, username, password } = req.body;

    // On peut envoyer soit `data`, soit directement email ou username
    const identifier = data || email || username;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifiants manquants" });
    }

    // Vérifie si c'est un email
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    let user;
    if (emailRegex.test(identifier)) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    // Vérif mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Génération JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    // Renvoie un user "public"
    const publicUser = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profilePhoto: user.profilePhoto,
    };

    res
      .status(200)
      .json({ token, user: publicUser, message: "Connexion réussie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
