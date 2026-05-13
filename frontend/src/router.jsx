/* ==========================================================================
IMPORTACIONES
========================================================================== */
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PlaceholderPage from "./components/ui/PlaceHolderPage";
import Settings from "./components/setting/Settings";
import Home from "./components/pages/Home";
import Search from "./components/pages/Search";
import Details from "./components/pages/Details";
import Catalog from "./components/pages/Catalog";
import Social from "./components/pages/Social";
import Profile from "./components/pages/Profile";
import Lists from "./components/pages/Lists";
import ListDetail from "./components/pages/ListDetail";
import NotFound from "./components/ui/NotFound";

/* ==========================================================================
OBJETO ROUTER CON TODAS LAS RUTAS
========================================================================== */

export const router = createBrowserRouter([
  {
    //En la raíz se renderiza RootLayout que sería la página principal que muestre el navbar del Admin o el de Usuario
    //Además muestra el resto del contenido en la parte baja
    path: "/",
    element: <RootLayout />,
    children: [
      //Si el usuario entra en la raíz, lo redigirimos al login y añadimos el prop replace para que no se pueda volver a la raíz cada ves que se pulse atrás en el navegador
      { index: true, element: <Navigate to="/login" replace /> },
      //Pantalla de login o registro a la aplicación
      { path: "login", element: <Login /> },

      /*========================================================================
       RUTAS PROTEGIDAS PARA USUARIOS LOGUEADOS
      ========================================================================*/

      //A partir de aquí se muestran todas las rutas de la app y todas están envueltas en un componente ProtectedRoute
      //que se encarga de verificar si el usuario está logueado y si tiene el rol adecuado
      {
        path: "*",
        element: (
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        )
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "details/:type/:id",
        element: (
          <ProtectedRoute>
            <Details />
          </ProtectedRoute>
        ),
      },
      {
        path: "search",
        element: (
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        ),
      },
      {
        path: "movies",
        element: (
          <ProtectedRoute>
            <Catalog type="movie" />
          </ProtectedRoute>
        ),
      },
      {
        path: "series",
        element: (
          <ProtectedRoute>
            <Catalog type="tv" />
          </ProtectedRoute>
        ),
      },
      {
        path: "list",
        element: (
          <ProtectedRoute>
            <Lists />
          </ProtectedRoute>
        ),
      },
      {
        path: "list/:id",
        element: (
          <ProtectedRoute>
            <ListDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "social",
        element: (
          <ProtectedRoute>
            <Social />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/:username",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute role="ADMIN">
            <PlaceholderPage title="Panel Admin" /> {/*Aquí irá el componente AdminDashboard, todavía por crear*/}
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute role="ADMIN">
            <PlaceholderPage title="Usuarios" /> {/*Aquí irá el componente Usuarios, todavía por crear*/}
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
