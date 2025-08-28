/*
  Header.jsx
  - Composant d'en-tête (navigation) affiché sur toutes les pages.
  - NavLink (react-router) est utilisé pour créer des liens qui savent
    si la route est active (utile pour styliser la route courante).
*/

import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { userConnected, logout } = useAuth();

  return (
    <header className="bg-white shadow-md p-4 flex flex-row justify-between items-center">
      {/* Logo / titre cliquable qui renvoie à la page d'accueil */}
      <NavLink to="/">
        <span className="text-xl font-bold text-blue-500">BLOG 3000</span>
      </NavLink>

      {/* Navigation principale */}
      <nav className="flex space-x-6">
        {/* NavLink remplace <a> pour permettre une navigation sans rechargement */}
        {userConnected ? (
          <>
            <NavLink
              to="/blog"
              className="text-gray-600 hover:text-black font-semibold"
            >
              Blog
            </NavLink>
            <NavLink
              to="/"
              className="text-gray-600 hover:text-black font-semibold"
              onClick={logout}
            >
              Déconnexion
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="text-gray-600 hover:text-black font-semibold"
            >
              Connexion
            </NavLink>
            <NavLink
              to="/register"
              className="text-gray-600 hover:text-black font-semibold"
            >
              Inscription
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
