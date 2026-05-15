import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import api from "../../api";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie, mediaType, className }) {
    const cardRef = useRef(null);
    const imgRef = useRef(null);
    const overlayRef = useRef(null);
    const badgeRef = useRef(null);
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const type = mediaType || movie.media_type;

    useLayoutEffect(() => {
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(badgeRef.current, { opacity: 0, scale: 0.7 });
    }, []);

    const handleMouseEnter = () => {
        // Imagen: zoom sutil
        gsap.to(imgRef.current, { scale: 1.07, duration: 0.5, ease: "power2.out" });
        // Overlay: fade in
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
        // Badge "Ver": pop in
        gsap.to(badgeRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: "back.out(1.5)", delay: 0.05 });
        // Borde glow
        cardRef.current.style.boxShadow = "0 0 0 1px rgba(168,85,247,0.5), 0 8px 32px rgba(124,58,237,0.18)";

        if (providers.length > 0) return;
        setLoadingProviders(true);
        api.get(`/home/providers/${type}/${movie.id}`)
            .then(res => setProviders(res.datos ?? []))
            .finally(() => setLoadingProviders(false));
    };

    const handleMouseLeave = () => {
        gsap.to(imgRef.current, { scale: 1, duration: 0.45, ease: "power2.out" });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" });
        gsap.to(badgeRef.current, { opacity: 0, scale: 0.7, duration: 0.2, ease: "power2.in" });
        cardRef.current.style.boxShadow = "none";
    };

    return (
        <div
            ref={cardRef}
            className={cn("relative overflow-hidden rounded-xl cursor-pointer", className)}
            style={{
                aspectRatio: "2 / 3",
                transition: "box-shadow 0.3s ease",
                background: "#111318"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate(`/details/${type}/${movie.id}`)}
        >
            {/* Póster */}
            <img
                ref={imgRef}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title || movie.name}
                className="w-full h-full object-cover"
                style={{ transformOrigin: "center center" }}
            />

            {/* Badge "Ver" — esquina superior derecha */}
            <div
                ref={badgeRef}
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    boxShadow: "0 2px 8px rgba(124,58,237,0.5)"
                }}
            >
                ›
            </div>

            {/* Overlay con información */}
            <div
                ref={overlayRef}
                className="absolute inset-0 flex flex-col justify-end p-3"
                style={{
                    background: "linear-gradient(to top, rgba(5,5,8,0.98) 0%, rgba(5,5,8,0.7) 45%, transparent 100%)"
                }}
            >
                {/* Título */}
                <h3 className="text-white text-sm font-semibold leading-tight mb-1.5">
                    {movie.title || movie.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <span style={{ color: "#eab308", fontSize: "11px" }}>★</span>
                    <span className="text-xs font-semibold text-white">{movie.vote_average?.toFixed(1)}</span>
                </div>

                {/* Providers */}
                {providers.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                        {providers.slice(0, 4).map((p) => (
                            <img
                                key={p.provider_id}
                                src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                                alt={p.provider_name}
                                title={p.provider_name}
                                className="w-5 h-5 rounded-md"
                            />
                        ))}
                    </div>
                )}

                {!loadingProviders && providers.length === 0 && (
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "#4b5563" }}>
                        Sin streaming
                    </p>
                )}
            </div>
        </div>
    );
}
