import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function MovieCard({ movie }) {
  const overlayRef = useRef(null);

  useLayoutEffect(() => {
    gsap.set(overlayRef.current, { y: 20, opacity: 0 });
  }, []);

  const handleMouseEnter = () => {
    gsap.to(overlayRef.current, { y: 0, opacity: 1, duration: 0.3 });
  };

  const handleMouseLeave = () => {
    gsap.to(overlayRef.current, { y: 20, opacity: 0, duration: 0.3 });
  };


  return (
    <div className="relative overflow-hidden w-48" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
      />
      <div ref={overlayRef} className="absolute bottom-0 left-0 right-0 p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)" }}>
        <h3 className="text-white text-xl font-bold">{movie.title || movie.name}</h3>
        <p>{movie.vote_average?.toFixed(1)}</p>
        <p className="text-white text-sm">{movie.overview?.slice(0, 80) + "..."}</p>
      </div>
    </div>
  );
}
