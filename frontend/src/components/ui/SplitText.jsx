import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ─── PROPS ────────────────────────────────────────────────────────────────────
// text        → el texto que quieres animar
// className   → clases CSS/Tailwind para el contenedor
// delay       → tiempo en segundos antes de que empiece la animación
// duration    → duración de la animación de cada letra
// stagger     → tiempo entre la animación de cada letra
// y           → distancia vertical desde donde entran las letras (en px)
export default function SplitText({
  text,
  className = "",
  delay = 0,
  duration = 0.6,
  stagger = 0.04,
  y = 20,
}) {
  // useRef nos da acceso directo al elemento del DOM sin re-renderizar
  const containerRef = useRef(null);

  useEffect(() => {
    const letters = containerRef.current.querySelectorAll(".split-letter");

    // Primero establecemos el estado inicial manualmente
    // gsap.set aplica estilos instantáneamente sin animación
    gsap.set(letters, { opacity: 0, y: y });

    // Luego animamos HACIA el estado final que queremos
    // Con gsap.to no hay salto porque le decimos exactamente
    // dónde tiene que terminar: opacity 1 e y 0 (posición normal)
    gsap.to(letters, {
      opacity: 1, // termina completamente visible
      y: 0, // termina en su posición original
      duration,
      stagger,
      delay,
      ease: "power3.out",
    });
  }, []);
  // El [] vacío significa que solo se ejecuta al montarse el componente,
  // igual que el checkSession del AuthContext

  return (
    // aria-label mantiene el texto accesible para lectores de pantalla
    // porque lo vamos a dividir en spans individuales
    <span ref={containerRef} className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        // Cada letra va en su propio span para poder animarlas por separado
        // key={i} es el identificador único que React necesita en listas
        // &nbsp; es un espacio que no se colapsa (los espacios normales sí se colapsan en HTML)
        <span key={i} className="split-letter inline-block" aria-hidden="true">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
