/* ==========================================================================
IMPORTACIONES
========================================================================== */
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PlaceholderPage from "./components/ui/PlaceHolderPage";
import Settings from "./components/setting/Settings";

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
        path: "home",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Home" /> {/*Aquí irá el componente Home, todavía por crear*/}
          </ProtectedRoute>
        ),
      },
      {
        path: "movies",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Películas" /> {/*Aquí irá el componente Movies, todavía por crear*/}
          </ProtectedRoute>
        ),
      },
      {
        path: "series",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Series" /> {/*Aquí irá el componente Series, todavía por crear*/}
          </ProtectedRoute>
        ),
      },
      {
        path: "list",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Mi Lista" /> {/*Aquí irá el componente MyList, todavía por crear*/}
          </ProtectedRoute>
        ),
      },
      {
        path: "friends",
        element: (
          <ProtectedRoute>
            <PlaceholderPage title="Amigos" /> {/*Aquí irá el componente Friends, todavía por crear*/}
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
