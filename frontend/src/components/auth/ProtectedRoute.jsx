import { useAuth } from "../../context/UseAuth";
import { Navigate } from "react-router-dom";

//Este componente envuelve un componente que sería la página que queremos proteger y ese sería el prop children
//Y el otro es el role por si queremos que la página necesite un rol concreto para acceder a ella
export default function ProtectedRoute({ children, role }) {
  //Hacemos uso de nuestro hook personalizado para obtener los datos del usuario logueado
  const { user } = useAuth();

  //Aquí comprobamos que si el objeto user tiene datos, significa que hay alguien logueado.
  //En caso contrario, no hay nadie logueado y por ello redirigimos al usuario al Login sin posibilidad de acceder a la página real
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //En este caso lo que hacemos es que si el rol del usuario logueado es igual al rol que le pasamos por parámetro se podrá acceder a dicha página
  //En caso contrario, el usuario está logueado pero no con el rol necesario y por lo tanto lo redigirimos a la página principal (HOME)
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  //Con ello devolvemos la página en la que
  return children;
}
