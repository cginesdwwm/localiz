// gérer tout ce qui est authentification mais que pour les requêtes http

import { BASE_URL } from "../utils/url";

export async function signUp(values) {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
    });
    const newUserMessage = await response.json();
    return newUserMessage;
  } catch (error) {
    console.log(error);
  }
}
