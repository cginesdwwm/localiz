// gérer tout ce qui est authentification mais que pour les requêtes http

import { BASE_URL } from "../utils/url";

// Inscription
export async function signUp(values) {
  try {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // si le backend renvoie une erreur (ex: 400, 500), on lève une exception
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur à l'inscription");
    }

    const newUserMessage = await response.json();
    return newUserMessage;
  } catch (error) {
    console.error("Erreur signUp:", error);
    return { message: error.message };
  }
}

// Connexion
export async function login(values) {
  try {
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur à la connexion");
    }

    const loginMessage = await response.json();
    return loginMessage;
  } catch (error) {
    console.error("Erreur login:", error);
    return { message: error.message };
  }
}
