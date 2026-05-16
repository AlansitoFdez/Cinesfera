import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import api from "../../api";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie, mediaType, className }) {
    const cardRef = useRef(null);
    const imgRef = useRef(null);
    const overlayRef = useRef(null);
    const overlayInnerRef = useRef(null);
    const shimmerRef = useRef(null);
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const type = mediaType || movie.media_type;
    const rating = movie.vote_average?.toFixed(1);
    const ratingPct = Math.round((movie.vote_average / 10) * 100);
    const mediaLabel = type === "movie" ? "Film" : "Series";

    useLayoutEffect(() => {
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(overlayInnerRef.current, { y: 8, opacity: 0 });
        if (shimmerRef.current) gsap.set(shimmerRef.current, { xPercent: -120, opacity: 0 });
    }, []);

    const handleMouseEnter = () => {
        gsap.to(imgRef.current, { scale: 1.08, duration: 0.55, ease: "power2.out" });
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.28, ease: "power2.out" });
        gsap.to(overlayInnerRef.current, { y: 0, opacity: 1, duration: 0.38, ease: "power2.out", delay: 0.06 });

        gsap.fromTo(shimmerRef.current,
            { xPercent: -120, opacity: 0.7 },
            { xPercent: 220, opacity: 0, duration: 0.65, ease: "power1.out", delay: 0.08 }
        );

        cardRef.current.style.boxShadow = "0 0 0 1.5px rgba(124,58,237,0.55), 0 12px 40px rgba(109,40,217,0.22)";

        if (providers.length > 0) return;
        setLoadingProviders(true);
        api.get(`/home/providers/${type}/${movie.id}`)
            .then(res => setProviders(res.datos ?? []))
            .finally(() => setLoadingProviders(false));
    };

    const handleMouseLeave = () => {
        gsap.to(imgRef.current, { scale: 1, duration: 0.45, ease: "power2.out" });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, ease: "power2.in" });
        gsap.to(overlayInnerRef.current, { y: 8, opacity: 0, duration: 0.18, ease: "power2.in" });
        cardRef.current.style.boxShadow = "none";
    };

    const ratingColor = ratingPct >= 70 ? "#4ade80" : ratingPct >= 50 ? "#fbbf24" : "#f87171";
    const ratingBarColor = ratingPct >= 70 ? "#22c55e" : ratingPct >= 50 ? "#eab308" : "#ef4444";

    return (
        <div
            ref={cardRef}
            className={cn("relative overflow-hidden rounded-xl cursor-pointer", className)}
            style={{
                aspectRatio: "2 / 3",
                transition: "box-shadow 0.3s ease",
                background: "#0e0f14"
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate(`/details/${type}/${movie.id}`)}
        >
            {/* Skeleton mientras carga el póster */}
            {!imgLoaded && (
                <div
                    className="absolute inset-0 animate-pulse"
                    style={{ background: "linear-gradient(135deg, #0e0f14 0%, #16181f 50%, #0e0f14 100%)" }}
                />
            )}

            {/* Póster */}
            <img
                ref={imgRef}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title || movie.name}
                className="w-full h-full object-cover"
                style={{ transformOrigin: "center center" }}
                onLoad={() => setImgLoaded(true)}
            />

            {/* Shimmer scan al hacer hover */}
            <div
                ref={shimmerRef}
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    width: "55%",
                    background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)"
                }}
            />

            {/* Badge rating — siempre visible */}
            <div
                className="absolute top-2 left-2 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded"
                style={{
                    background: "rgba(6,8,16,0.78)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.07)"
                }}
            >
                <span style={{ color: "#eab308", fontSize: "9px" }}>★</span>
                <span className="text-[10px] font-semibold text-white">{rating}</span>
            </div>

            {/* Badge tipo — siempre visible */}
            <div
                className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded-sm"
                style={{
                    background: "rgba(6,8,16,0.78)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.07)"
                }}
            >
                <span
                    className="text-[8px] font-semibold uppercase"
                    style={{ color: "rgba(255,255,255,0.36)", letterSpacing: "0.12em" }}
                >
                    {mediaLabel}
                </span>
            </div>

            {/* Overlay hover */}
            <div
                ref={overlayRef}
                className="absolute inset-0 z-20 flex flex-col justify-end p-3"
                style={{
                    background: "linear-gradient(to top, rgba(6,8,16,0.99) 0%, rgba(6,8,16,0.78) 40%, rgba(6,8,16,0.08) 70%, transparent 100%)"
                }}
            >
                <div ref={overlayInnerRef} className="flex flex-col gap-1.5">
                    {/* Título */}
                    <h3 className="text-white text-sm font-semibold leading-tight">
                        {movie.title || movie.name}
                    </h3>

                    {/* Barra de puntuación */}
                    <div className="flex items-center gap-2">
                        <div
                            className="flex-1 h-[3px] rounded-full overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${ratingPct}%`, background: ratingBarColor }}
                            />
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: ratingColor }}>
                            {ratingPct}%
                        </span>
                    </div>

                    {/* Providers */}
                    {providers.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-0.5">
                            {providers.slice(0, 4).map(p => (
                                <img
                                    key={p.provider_id}
                                    src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                                    alt={p.provider_name}
                                    title={p.provider_name}
                                    className="w-5 h-5 rounded-md"
                                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                                />
                            ))}
                        </div>
                    )}

                    {!loadingProviders && providers.length === 0 && (
                        <p className="text-[9px] uppercase tracking-wider" style={{ color: "#374151" }}>
                            Sin streaming
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
