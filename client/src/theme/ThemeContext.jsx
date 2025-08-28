import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("localiz_theme");
    return saved || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("localiz_theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const setLight = () => setTheme("light");
  const setDark = () => setTheme("dark");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setLight, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
