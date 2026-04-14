import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import useDetailData from "../../hooks/useDetailData";
import Reviews from "../ui/reviews";

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ trailerKey, backdropPath, title }) {
    return (
        <div className="relative w-full overflow-hidden" style={{ height: "65vh" }}>
            {trailerKey ? (
                <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&modestbranding=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{
                        border: "none",
                        pointerEvents: "none",
                        width: "100vw",
                        height: "56.25vw",
                        minHeight: "65vh",
                        minWidth: "177.78vh",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)"
                    }}
                />
            ) : (
                <img
                    src={`https://image.tmdb.org/t/p/original${backdropPath}`}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                />
            )}
            <div className="absolute inset-0" style={{
                background: "linear-gradient(to top, #0d1117 0%, rgba(13,17,23,0.3) 60%, transparent 100%)"
            }} />
            <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, #0d1117 0%, transparent 40%)"
            }} />
        </div>
    );
}

// ─── INFO ─────────────────────────────────────────────────────────────────────
function Info({ data, infoRef }) {
    return (
        <div ref={infoRef} className="relative z-10 flex gap-10 px-16 -mt-48 mb-16">
            {/* Póster */}
            <div className="shrink-0" style={{ width: "220px" }}>
                <img
                    src={`https://image.tmdb.org/t/p/w342${data.poster_path}`}
                    alt={data.title}
                    className="rounded-2xl w-full"
                    style={{
                        border: "1px solid rgba(168,85,247,0.25)",
                        boxShadow: "0 0 60px rgba(124,58,237,0.25), 0 20px 40px rgba(0,0,0,0.8)"
                    }}
                />
            </div>

            {/* Información */}
            <div className="flex flex-col gap-5 pt-32">
                <h1
                    className="text-5xl font-black text-white leading-tight"
                    style={{ fontFamily: "'Georgia', serif", letterSpacing: "0.02em", maxWidth: "700px" }}
                >
                    {data.title}
                </h1>

                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span style={{ color: "#fbbf24", fontSize: "1.1rem" }}>⭐</span>
                        <span className="text-white font-bold text-lg">
                            {data.vote_average?.toFixed(1)}
                        </span>
                        <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                            ({data.vote_count?.toLocaleString()} votos)
                        </span>
                    </div>
                    <span style={{ color: "#374151" }}>|</span>
                    <span style={{ color: "#9ca3af" }}>{data.release_date?.slice(0, 4)}</span>
                    {data.runtime && (
                        <>
                            <span style={{ color: "#374151" }}>|</span>
                            <span style={{ color: "#9ca3af" }}>{data.runtime} min</span>
                        </>
                    )}
                    {data.seasons && (
                        <>
                            <span style={{ color: "#374151" }}>|</span>
                            <span style={{ color: "#9ca3af" }}>{data.seasons.length} temporadas</span>
                        </>
                    )}
                </div>

                {data.genres?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {data.genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="rounded-full px-4 py-1.5 text-sm font-semibold"
                                style={{
                                    background: "rgba(124,58,237,0.15)",
                                    border: "1px solid rgba(168,85,247,0.3)",
                                    color: "#c084fc",
                                    letterSpacing: "0.03em"
                                }}
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                )}

                {data.overview && (
                    <p style={{ color: "#d1d5db", fontSize: "1rem", lineHeight: "1.8", maxWidth: "650px" }}>
                        {data.overview}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── REPARTO ──────────────────────────────────────────────────────────────────
function Cast({ cast, castRef }) {
    if (!cast?.length) return null;

    return (
        <section ref={castRef} className="px-16 mb-14">
            <SectionTitle>Reparto</SectionTitle>
            <div className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
                {cast.map((actor) => (
                    <div key={actor.id} className="shrink-0 flex flex-col gap-3" style={{ width: "120px" }}>
                        {actor.profile_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                alt={actor.name}
                                className="rounded-xl object-cover w-full"
                                style={{ height: "160px", border: "1px solid rgba(168,85,247,0.15)" }}
                            />
                        ) : (
                            <div
                                className="rounded-xl flex items-center justify-center w-full"
                                style={{
                                    height: "160px",
                                    background: "rgba(124,58,237,0.08)",
                                    border: "1px solid rgba(168,85,247,0.15)"
                                }}
                            >
                                <span style={{ fontSize: "2.5rem" }}>🎭</span>
                            </div>
                        )}
                        <div>
                            <p className="text-white text-sm font-semibold leading-tight">{actor.name}</p>
                            <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{actor.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── PROVIDERS ────────────────────────────────────────────────────────────────
function Providers({ providers, providersRef }) {
    return (
        <section ref={providersRef} className="px-16 mb-14">
            <SectionTitle>Disponible en</SectionTitle>
            {providers?.length > 0 ? (
                <div className="flex gap-4 flex-wrap">
                    {providers.map((provider) => (
                        <div
                            key={provider.provider_id}
                            className="flex items-center gap-3 rounded-2xl px-5 py-3 transition-all duration-200"
                            style={{
                                background: "rgba(15,15,20,0.95)",
                                border: "1px solid rgba(168,85,247,0.15)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.15)"}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="rounded-xl"
                                style={{ width: "40px", height: "40px" }}
                            />
                            <span className="text-white font-semibold">{provider.provider_name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ color: "#4b5563", fontSize: "0.9rem" }}>
                    No disponible en plataformas de streaming en España.
                </p>
            )}
        </section>
    );
}

// ─── HELPER: TÍTULO DE SECCIÓN ────────────────────────────────────────────────
function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <h2
                className="text-2xl font-black text-white uppercase tracking-widest shrink-0"
                style={{ fontFamily: "'Georgia', serif" }}
            >
                {children}
            </h2>
            <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.15)" }} />
        </div>
    );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Details() {
    const { type, id } = useParams();
    const { data, loading, error } = useDetailData(type, id);

    const infoRef = useRef(null);
    const castRef = useRef(null);
    const providersRef = useRef(null);
    const reviewsRef = useRef(null);

    useEffect(() => {
        if (!data) return;
        const sections = [infoRef, castRef, providersRef, reviewsRef]
            .map(r => r.current)
            .filter(Boolean);
        gsap.fromTo(
            sections,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12, delay: 0.1 }
        );
    }, [data]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
                <p className="uppercase tracking-widest text-sm" style={{ color: "#6b7280" }}>Cargando...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
                <p style={{ color: "#f87171", fontSize: "0.9rem" }}>No se pudo cargar el contenido.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: "#0d1117" }}>
            <Hero trailerKey={data.trailer_key} backdropPath={data.backdrop_path} title={data.title} />
            <Info data={data} infoRef={infoRef} />
            <Cast cast={data.cast} castRef={castRef} />
            <Providers providers={data.providers} providersRef={providersRef} />
            <Reviews tmdb_id={data.tmdb_id} media_type={type} title={data.title} poster_path={data.poster_path} vote_average={data.vote_average} />
        </div>
    );
}