import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import api from "../../api";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie, mediaType, className }) {
  const overlayRef = useRef(null);
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const type = mediaType || movie.media_type

  useLayoutEffect(() => {
    gsap.set(overlayRef.current, { y: 20, opacity: 0 });
  }, []);

  const handleMouseEnter = () => {
    gsap.to(overlayRef.current, { y: 0, opacity: 1, duration: 0.3 });

    const fetchProviders = async () => {
      if (providers.length > 0) return;
      setLoading(true);
      const response = await api.get(`/home/providers/${type}/${movie.id}`);
      setProviders(response.datos);
      setLoading(false);
    };
    fetchProviders();
  };

  const handleMouseLeave = () => {
    gsap.to(overlayRef.current, { y: 20, opacity: 0, duration: 0.3 });
  };

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/details/${type}/${movie.id}`)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
      />
      <div
        ref={overlayRef}
        className="absolute bottom-0 left-0 right-0 p-3"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)",
        }}
      >
        <h3 className="text-white text-sm font-bold">
          {movie.title || movie.name}
        </h3>
        <p className="text-yellow-300">⭐{movie.vote_average?.toFixed(1)}</p>
        <p className="text-white text-xs">
          {movie.overview?.slice(0, 80) + "..."}
        </p>
        {loading && <p className="text-xs text-gray-400 mt-1">...</p>}

        {providers.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {providers.map((provider) => (
              <img
                key={provider.provider_id}
                src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                alt={provider.provider_name}
                title={provider.provider_name}
                className="w-6 h-6 rounded-md"
              />
            ))}
          </div>
        )}

        {!loading && providers.length === 0 && (
          <p className="text-xs text-gray-500 mt-1">No en streaming</p>
        )}
      </div>
    </div>
  );
}
