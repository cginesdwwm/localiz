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

import React, {
  StrictMode,
  useState,
  useMemo,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { LikesProvider } from "./context/LikesContext";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary"; // You'll need to create this

// --- Theme Context with persistence ---
export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  // Persist theme changes to localStorage
  useEffect(() => {
    localStorage.setItem("theme", theme);
    // Apply theme to document root for CSS variables
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Memoize the toggle function to prevent unnecessary re-renders
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Memoize the context value
  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme === "dark" ? "dark" : ""} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

const AppProviders = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <LikesProvider>{children}</LikesProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

// --- Point d'entrée React ---
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);
