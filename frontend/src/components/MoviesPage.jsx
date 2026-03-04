// MoviesPage.jsx
// Llama a tu propio backend en /api/movies/top10-comedias
// El backend devuelve: [{ title, poster_path, release_date, watch_providers: ["Netflix", ...] }]

import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard"; // ajusta el path según tu estructura

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/movies/top10-comedias", {
          withCredentials: true,
        });
        setMovies(data);
      } catch (err) {
        setError("No se pudieron cargar las películas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0d1117" }}
    >
      {/* Fondo degradado igual que el Login */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(88,28,135,0.2) 0%, #0d1117 70%)",
        }}
      />

      {/* Contenido — mt-6 deja espacio cómodo bajo el navbar (que ya tiene py-4) */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-4 mt-6 pb-12">

        {/* Cabecera de sección */}
        <div className="mb-6">
          <h2
            className="text-white font-black uppercase"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              letterSpacing: "0.2em",
            }}
          >
            Top 10 <span style={{ color: "#a855f7" }}>Comedias</span>
          </h2>
          <div style={{ width: "2.5rem", height: "2px", background: "#7c3aed", marginTop: "0.4rem", borderRadius: "9999px" }} />
        </div>

        {/* Estados */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div
              className="rounded-full animate-spin"
              style={{
                width: "32px",
                height: "32px",
                border: "2px solid rgba(168,85,247,0.15)",
                borderTopColor: "#a855f7",
              }}
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

        {/* Grid de cards */}
        {!loading && !error && (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
