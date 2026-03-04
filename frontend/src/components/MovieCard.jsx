// MovieCard.jsx
// Props:
//   movie: objeto de TMDB (title, poster_path, release_date, watch_providers)
//   watch_providers: array de strings ["Netflix", "HBO Max", ...] — llega desde tu backend

const PLATFORM_COLORS = {
  "Netflix":      { bg: "rgba(229,9,20,0.15)",   border: "rgba(229,9,20,0.4)",   text: "#ff4d4d" },
  "HBO Max":      { bg: "rgba(30,30,180,0.15)",   border: "rgba(80,80,220,0.4)",  text: "#8888ff" },
  "Disney+":      { bg: "rgba(17,60,170,0.15)",   border: "rgba(17,100,220,0.4)", text: "#5599ff" },
  "Amazon Prime": { bg: "rgba(0,168,225,0.12)",   border: "rgba(0,168,225,0.4)",  text: "#00b8e6" },
  "Apple TV+":    { bg: "rgba(255,255,255,0.07)",  border: "rgba(255,255,255,0.2)", text: "#e0e0e0" },
  "Movistar+":    { bg: "rgba(0,100,220,0.12)",   border: "rgba(0,130,255,0.35)", text: "#4da6ff" },
  "SkyShowtime":  { bg: "rgba(200,60,60,0.12)",   border: "rgba(220,80,80,0.35)", text: "#ff8080" },
};

const DEFAULT_PLATFORM = { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.3)", text: "#c084fc" };

function PlatformPill({ name }) {
  const style = PLATFORM_COLORS[name] || DEFAULT_PLATFORM;
  return (
    <span
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "0.2rem 0.55rem",
        borderRadius: "9999px",
        whiteSpace: "nowrap",
      }}
    >
      {name}
    </span>
  );
}

export default function MovieCard({ movie }) {
  const {
    title,
    poster_path,
    release_date,
    watch_providers = [],
  } = movie;

  const year = release_date ? release_date.slice(0, 4) : "—";
  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : null;

  return (
    <div
      className="relative flex flex-col rounded-xl overflow-hidden group"
      style={{
        background: "rgba(15,15,20,0.95)",
        border: "1px solid rgba(168,85,247,0.12)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(124,58,237,0.25), 0 4px 24px rgba(0,0,0,0.6)";
        e.currentTarget.style.borderColor = "rgba(168,85,247,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.5)";
        e.currentTarget.style.borderColor = "rgba(168,85,247,0.12)";
      }}
    >
      {/* Póster */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2/3", background: "#0d0d12" }}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
            style={{ transition: "transform 0.4s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ color: "#374151" }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 9v9A2.25 2.25 0 004.5 18.75z" />
            </svg>
          </div>
        )}

        {/* Año — badge encima del póster */}
        <div
          className="absolute top-2 right-2"
          style={{
            background: "rgba(10,10,15,0.85)",
            border: "1px solid rgba(168,85,247,0.25)",
            borderRadius: "9999px",
            padding: "0.15rem 0.55rem",
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "#a855f7",
            letterSpacing: "0.1em",
            backdropFilter: "blur(4px)",
          }}
        >
          {year}
        </div>
      </div>

      {/* Info inferior */}
      <div className="flex flex-col gap-2 p-3">
        <h3
          className="text-white font-semibold leading-tight"
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.01em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h3>

        {/* Pills de plataformas */}
        {watch_providers.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {watch_providers.map((p) => (
              <PlatformPill key={p} name={p} />
            ))}
          </div>
        ) : (
          <span style={{ fontSize: "0.6rem", color: "#4b5563", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            No disponible en streaming
          </span>
        )}
      </div>
    </div>
  );
}
