import { useState } from "react";
import api from "../../api.js";
import { useAuth } from "../../hooks/UseAuth";
import { useNavigate } from "react-router-dom";
import SplitText from "../ui/SplitText";

//Componente de Login o Singup que aparecerá nada más abrir la app para que la gente tenga que registrarse obligatoriamente 
export default function Login() {
  //Recibimos la funcion de login del hook personalizado que creamos
  const { login } = useAuth();
  //Recibimos la funcion navigate para poder redirigir al usuario
  const navigate = useNavigate();
  //Estado para saber si estamos en la pantalla de login o en la de registro
  const [isLogin, setIsLogin] = useState(true);
  //Estado para guardar todos los datos del formulario, todo en un solo estado
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    biography: "",
  });
  //Estado para guardar los errores que surjan
  const [error, setError] = useState("");
  //Estado para mantener la pantalla en modo de carga durante el proceso de login o registro
  const [loading, setLoading] = useState(false);

  //Función que se ejecutara cada vez que el usuario escriba algo en los campos de formulario
  //Con esta funcion recogemos un evento llamado "e" y usamos desestructuración para el estado de form
  //Con e.target.name y e.target.value hacemos que el programa modifique la variable del estado form que tenga el mismo nombre que el campo usando el valor que añada el usuario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Función que se ejecutará al enviar el formulario, ya sea el de login o el de registro
  //Usamos async await para poder hacer la petición a la API de forma asíncrona
  const handleSubmit = async (e) => {
    //Con preventDefault evitamos que el formulario se envíe si existen errores
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      //Creamos una variable endpoint que cambiará dependiendo de la varibale isLogin
      //Si isLogin es True la ruta del endpoint será login, en caso contrario será signup
      const endpoint = isLogin ? "/login" : "/signup";
      //El cuerpo de la llamada, es decir, los datos que enviaremos al backend serán los de los campos email y password para el login
      //Sino se enviará el formulario completo
      const body = isLogin
        ? { email: form.email, password: form.password }
        : {
            username: form.username,
            email: form.email,
            password: form.password,
            biography: form.biography,
          };

      //Aquí hacemos la llamada a la api con la ruta auth y luego haciendo uso de la variable endpoint
      //Hacemos la petición post con el cuerpo correspondiente
      const response = await api.post(`/auth${endpoint}`, body);

      // Al iniciar sesión o al registrarte, hacemos que el contexto inicie sesión y guarde los datos del usuario autenticado para que esté a disposición del resto de páginas de la app
      login(response.datos);

      // Recogemos el campo role de los datos para redirigir al usuario a la página correspondiente
      //En caso de ser usuario se redigirá al Home de la app y si es Admin se le enviará a la página principal del Dashboard de Admin
      if (response.datos.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      // El interceptor ya normaliza el error con { mensaje: "..." }
      setError(err.mensaje || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Contenedor principal de la app
       **min-h-screen - La altura mínima será toda la pantalla para que si el contenido es mayor se expanda a lo largo
       **flex - Activamos flexbox para que los hijos también lo reciban
       **items-center - Centra los hijos verticalmente
       **justify-center - Centra los hijos horizontalmente
       **relative - Establece el contexto de posicionamiento como principal para que luego sus hijos usen absolute y se ajusten al padre que es relative
       **overflow-hidden - Oculta cualquier contenido que se salga del contenedor

       **Apartado Style: Añadimos color concreto al background ya que Tailwind no tiene este color en sus paletas
    */
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#0d1117" }}>
      {/* Degradado del fondo
          **absolute - Como comentamos con absolute se ajusta relativamente al padre que es el que tiene relative
          **inset-0 - Hace que el contenedor ocupe todo el espacio disponible del padre

          **Apartado Style: Con Tailwind es dificil hacer un degradado asi que usamos style
          **radial-gradient(ellipse at 60% 40%, ...) - con esto creamos un degradado en forma de elipse que empieza en el punto 60% 40% (un poco a la derecha del centro y por arriba del centro)
          **rgba - muestra el color de la elipse con 30 por ciento de opacidad
          **color + 70% - ponemos el mismo color del fondo con 70% y con ello el color del centro se irá conviertiendo en el color del fondo hacia los bordes del contenedor 
      */}
      <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at 60% 40%, rgba(88,28,135,0.3) 0%, #0d1117 70%)",}} />

      {/* Contenedor central
          **relative - Como 
          **z-10 - Coloca el contenedor por encima de los demás para que quede por encima del degradado
          **w-full - Ocupa el 100% del ancho del espacio disponible
          **max-w-md - tiene un ancho maximo de 28rem(448px). Cuando se ve en pantalla grande la tarjeta queda centrada
          **mx-4 - Añade un margen de 1rem(16px) a los lados para que la vista de móvil no se pegue a los bordes
      */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo
            **text-center - Centra el contenido horizontalmente
            **mb-10 - Añade un margen de 2.5rem(40px) por debajo del contenido
        */}
        <div className="text-center mb-10">
          {/* 
             **inline-flex - Flexbox en línea y esto ocupa lo que ocupa el tamaño del contenido
             **items-center - alinea verticalmente 
             **gap-2 - 0.5rem entre el círculo y el texto 
             **mb-2 - 0.5rem entre el título y el subtítulo
          */}
          <div className="inline-flex items-center gap-2 mb-2">
            {/* Icono Circular Exterior
                **w-8 - ancho de 2rem(32px)
                **h-8 - alto de 2rem(32px)
                **rounded-full - Convierte el div en perfectamente circular
                **flex items-center justify-center - para centrar el punto interior tanto vertical como horizontal

                **Apartado Style - Le aplicamos un border solido y grueso de 2px y un color morado
            */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ border: "2px solid #a855f7" }}>
              {/* Icono Circular Interior
                  **w-3 y h3 - 0.75rem(12px) de ancho y alto
                  **rounded-full - Completamente circular

                  **Apartado Style - Coloreamos todo el fondo del contenedor del mismo color que el exterior
              */}
              <div className="w-3 h-3 rounded-full" style={{ background: "#a855f7" }} />
            </div>
            {/* Título Cinesfera
                **text-4xl - tamaño de fuente 2.25rem(36px)
                **font-black - para que la letra sea lo más gruesa disponible
                **text-white - color del texto
                **uppercase - para pasarlo todo a mayúsculas

                **apartado Style - cambiamos estilo de fuente y le añadimos un espaciado entre letra y letra para que el efecto se vea mejor
            */}
            <h1
              className="text-4xl font-black text-white uppercase"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.3em" }}
            >
              {/* Componentes SplitText para el efecto del texto*/}
              <SplitText
                text="Cin"
                delay={0.1}
                duration={0.4}
                stagger={0.03}
                y={10}
              />
              <SplitText
                text="esfera"
                className="text-purple-500"
                delay={0.25}
                duration={0.4}
                stagger={0.03}
                y={10}
              />
            </h1>
          </div>
          {/* Subtítulo
              **text-xs - fuente muy pequeña 0.75rem(12px)
              **tracking-widest - espacio entre letras de Tailwind 0.1em
              **uppercase - todo a mayúsculas

              **apartado style - color de las letras para que tenga un aspecto de subtítulo
          */}
          <p className="text-xs tracking-widest uppercase" style={{ color: "#6b7280" }}>
            Tu universo cinematográfico
          </p>
        </div>

        {/* Card Principal
            **
        */}
        <div className="rounded-2xl p-8 border" style={{background: "rgba(15,15,20,0.95)", borderColor: "rgba(168,85,247,0.15)",
            boxShadow: "0 0 60px rgba(124,58,237,0.1), 0 25px 50px rgba(0,0,0,0.8)",}}>
          {/* Toggle */}
          <div
            className="flex mb-8 rounded-xl p-1"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <button
              onClick={() => setIsLogin(true)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300"
              style={
                isLogin
                  ? { background: "#7c3aed", color: "white", boxShadow: "0 4px 15px rgba(124,58,237,0.5)" }
                  : { color: "#6b7280" }
              }
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300"
              style={
                !isLogin
                  ? { background: "#7c3aed", color: "white", boxShadow: "0 4px 15px rgba(124,58,237,0.5)" }
                  : { color: "#6b7280" }
              }
            >
              Registrarse
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Tu nombre en Cinesfera"
                  className="rounded-xl px-4 py-3 text-sm text-white outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-widest" style={{ color: "#9ca3af" }}>
                  Biografía <span style={{ color: "#4b5563" }}>(opcional)</span>
                </label>
                <textarea
                  name="biography"
                  value={form.biography}
                  onChange={handleChange}
                  placeholder="Cuéntanos algo sobre ti..."
                  rows={3}
                  className="rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            )}

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-4 rounded-xl font-bold tracking-widest uppercase text-sm text-white transition-all duration-200"
              style={{
                background: loading
                  ? "rgba(124,58,237,0.4)"
                  : "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                boxShadow: loading
                  ? "none"
                  : "0 8px 25px rgba(124,58,237,0.5), 0 0 0 1px rgba(168,85,247,0.2)",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.15em",
              }}
            >
              {loading ? "Cargando..." : isLogin ? "Entrar" : "Crear cuenta"}
            </button>
          </form>
        </div>
      </div>

      {/* Tira izquierda */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-around opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-6 mx-1 rounded-sm" style={{ background: "#374151" }} />
        ))}
      </div>

      {/* Tira derecha */}
      <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-around opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-6 mx-1 rounded-sm" style={{ background: "#374151" }} />
        ))}
      </div>

      {/* Viñeta */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)" }}
      />
    </div>
  );
}