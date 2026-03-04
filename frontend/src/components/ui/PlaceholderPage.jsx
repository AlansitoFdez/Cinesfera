export default function PlaceholderPage({ title }) {
  return (
    // min-h-screen → ocupa toda la pantalla
    // pt-24 → padding top para que el contenido no quede tapado por el navbar
    <div
      className="min-h-screen flex items-center justify-center pt-24"
      style={{ background: "#0d1117" }}
    >
      <div className="text-center">
        <h1
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: 900,
            fontSize: "2.5rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "white",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: "#6b7280",
            marginTop: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          Página en construcción
        </p>
      </div>
    </div>
  );
}
