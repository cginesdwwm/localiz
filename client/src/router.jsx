/*
  router.jsx
  - Définit les routes de l'application à l'aide de createBrowserRouter.
  - Chaque route a un `path` (URL) et un `element` (composant React à afficher).
  - Important pour débutant : les chemins de route sont sensibles à la casse par
    défaut dans react-router v6+ (donc `/blog` != `/Blog`).
    Pour que l'URL `/Blog` fonctionne aussi, on ajoute un alias avec le même composant.
*/

import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Deals from "./pages/Deals/Deals";
import DealExample from "./pages/Deals/DealExample";

import Register from "./pages/Forms/Register";
import Login from "./pages/Forms/Login";
import ChangePassword from "./pages/Forms/ChangePassword";
import ForgotPassword from "./pages/Forms/ForgotPassword";

import Homepage from "./pages/Homepage/Homepage";
import Splashscreen from "./pages/Homepage/Splashscreen";

import ListingExample from "./pages/Listings/ListingExample";
import SwapAndDonate from "./pages/Listings/SwapAndDonate";

import About from "./pages/Other/About";
import DeleteAccount from "./pages/Other/DeleteAccount";
import ErrorPage from "./pages/Other/ErrorPage";
import LegalInfo from "./pages/Other/LegalInfo";

import ProfileMe from "./pages/Profile/ProfileMe";
import ProfileOther from "./pages/Profile/ProfileOther";

import Search from "./pages/Search/Search";
import SearchDeals from "./pages/Search/SearchDeals";
import SearchDonations from "./pages/Search/SearchDonations";
import SearchSwaps from "./pages/Search/SearchSwaps";

import CookieSettings from "./pages/Settings/CookieSettings";
import Language from "./pages/Settings/Language";
import ManageAccount from "./pages/Settings/ManageAccount";
import Settings from "./pages/Settings/Settings";
import Theme from "./pages/Settings/Theme";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />, // Page affichée si une route n'existe pas
    children: [
      { path: "/", element: <Splashscreen /> },
      { path: "/homepage", element: <Homepage /> },

      // --- Auth / Forms ---
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/change-password", element: <ChangePassword /> },

      // --- Deals ---
      { path: "/deals", element: <Deals /> },
      { path: "/deals/:id", element: <DealExample /> }, // Exemple d'annonce unique

      // --- Listings (Troc & Don) ---
      { path: "/listings", element: <SwapAndDonate /> },
      { path: "/listings/:id", element: <ListingExample /> },

      // --- Profiles ---
      { path: "/profile/me", element: <ProfileMe /> },
      { path: "/profile/:userId", element: <ProfileOther /> },

      // --- Search ---
      { path: "/search", element: <Search /> },
      { path: "/search/deals", element: <SearchDeals /> },
      { path: "/search/donations", element: <SearchDonations /> },
      { path: "/search/swaps", element: <SearchSwaps /> },

      // --- Settings ---
      { path: "/settings", element: <Settings /> },
      { path: "/settings/manage-account", element: <ManageAccount /> },
      { path: "/settings/theme", element: <Theme /> },
      { path: "/settings/cookies", element: <CookieSettings /> },
      { path: "/settings/language", element: <Language /> },

      // --- Other ---
      { path: "/about", element: <About /> },
      { path: "/legal", element: <LegalInfo /> },
      { path: "/delete-account", element: <DeleteAccount /> },
    ],
  },
]);
