import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DevModeProvider } from "./context/DevModeContext";
import { router } from "./router";

function App() {
  //Aquí vamos envolviendo la app con los Providers. Primeor el Auth porque es el que recoge los datos del usuario al completo
  //Luego ponemos el DevMode para que se pueda acceder a si el modo dev está activado y la funcion del cambio a modo dev
  //Por último tenemos el RouterProvider que está conectado a nuestro archivo de rutas que generamos anteriormente
  return (
    <AuthProvider>
      <DevModeProvider>
        <RouterProvider router={router} />
      </DevModeProvider>
    </AuthProvider>
  );
}

export default App;