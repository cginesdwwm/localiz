/*
  main.jsx
  Fichier d'entrée de l'application React.
  - createRoot: point d'attache de l'application dans le DOM (élément #root).
  - StrictMode: mode de développement React qui active des vérifications supplémentaires.
  - RouterProvider: fournis les routes (react-router) à l'application.
  - LikesProvider: un contexte (si présent) pour partager l'état des "likes" dans l'app.

  Commentaires: ce fichier ne contient pas de logique métier, il assemble simplement
  les fournisseurs (providers) et le routeur pour rendre l'application.
*/

import React, { StrictMode, useState, useMemo, createContext } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { LikesProvider } from "./context/LikesContext";

// --- Création du contexte de thème ---
export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Valeur partagée via le contexte
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};

// --- Point d'entrée React ---
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LikesProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </LikesProvider>
  </StrictMode>
);
