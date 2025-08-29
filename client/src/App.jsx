/*
  App.jsx
  - Composant principal qui définit la mise en page générale (header + contenu + toaster).
  - Outlet (react-router) est une zone où les composants enfants s'affichent
    en fonction de la route courante (définie dans `router.jsx`).
  - Toaster affiche les notifications (ex: succès, erreurs) si la librairie est utilisée.
*/

import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
// import { BlogProvider } from "./context/BlogProvider";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header/Header";
import { Toaster } from "react-hot-toast";

// Inner App component that uses the context hooks
function AppContent() {
  const { loading } = useAuth();
  const { theme } = useTheme();

  // Apply theme class to body for global styles
  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
  }, [theme]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header visible on all pages */}
      <Header />

      {/* Main content area with error boundary */}
      <main className="flex-1 flex items-center justify-center overflow-auto">
        <div className="w-full max-w-7xl mx-auto px-4">
          <Outlet />
        </div>
      </main>

      {/* Toaster for notifications - now inside providers so it can access auth state */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme === "dark" ? "#1f2937" : "#ffffff",
            color: theme === "dark" ? "#f9fafb" : "#1f2937",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </div>
  );
}

// Main App component with all providers
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BlogProvider>
          <AppContent />
        </BlogProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
