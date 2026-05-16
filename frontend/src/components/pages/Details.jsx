import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import useDetailData from "../../hooks/useDetailData";
import Reviews from "../ui/Reviews";
import AddToListDropdown from "../ui/Addtolistdropdown";

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ trailerKey, backdropPath, title }) {
    return (
        <div className="relative w-full overflow-hidden h-[50vh] md:h-[75vh]">
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
                        minHeight: "50vh",
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

            {/* Grano cinematográfico */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
                    opacity: 0.5,
                    mixBlendMode: "overlay"
                }}
            />
            <div className="absolute inset-0" style={{
                background: "linear-gradient(to top, #0d1117 0%, rgba(13,17,23,0.55) 40%, rgba(13,17,23,0.1) 70%, transparent 100%)"
            }} />
            <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, rgba(13,17,23,0.55) 0%, transparent 40%)"
            }} />
            <div className="absolute inset-0" style={{
                background: "linear-gradient(to bottom, rgba(13,17,23,0.35) 0%, transparent 18%)"
            }} />
        </div>
    );
}

// ─── TÍTULO DE SECCIÓN ────────────────────────────────────────────────────────
function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-3 mb-7">
            <div
                className="w-[3px] h-5 rounded-full shrink-0"
                style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }}
            />
            <h2 className="text-lg font-semibold tracking-wide" style={{ color: "#e5e7eb" }}>
                {children}
            </h2>
        </div>
    );
}

// ─── INFO ─────────────────────────────────────────────────────────────────────
function Info({ data, infoRef, mediaType }) {
    return (
        <div
            ref={infoRef}
            className="relative z-10 flex flex-row gap-4 md:gap-10 px-4 md:px-14 -mt-16 md:-mt-52 mb-12 md:mb-16"
        >
            {/* Póster */}
            <div className="shrink-0 w-28 md:w-[210px]">
                <img
                    src={`https://image.tmdb.org/t/p/w342${data.poster_path}`}
                    alt={data.title || data.name}
                    className="rounded-xl w-full"
                    style={{
                        border: "1px solid rgba(168,85,247,0.28)",
                        boxShadow: "0 0 80px rgba(124,58,237,0.18), 0 24px 48px rgba(0,0,0,0.9)"
                    }}
                />
            </div>

            {/* Columna de información */}
            <div className="flex flex-col gap-3 md:gap-5 pt-2 md:pt-36 min-w-0">
                {/* Badge tipo */}
                <span
                    className="self-start px-2.5 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em] rounded-sm text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}
                >
                    {mediaType === "movie" ? "Película" : "Serie"}
                </span>

                {/* Título */}
                <h1
                    className="font-bold text-white leading-tight"
                    style={{ fontSize: "clamp(1.1rem, 3.5vw, 3rem)" }}
                >
                    {data.title || data.name}
                </h1>

                {/* Metadata */}
                <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <div className="flex items-center gap-1">
                        <span style={{ color: "#eab308", fontSize: "11px" }}>★</span>
                        <span className="text-white font-bold text-sm">{data.vote_average?.toFixed(1)}</span>
                        <span className="text-xs hidden sm:inline" style={{ color: "#6b7280" }}>
                            ({data.vote_count?.toLocaleString()})
                        </span>
                    </div>
                    {data.release_date && (
                        <>
                            <div className="w-px h-3 md:h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
                            <span className="text-xs md:text-sm" style={{ color: "#9ca3af" }}>
                                {data.release_date.slice(0, 4)}
                            </span>
                        </>
                    )}
                    {data.runtime && (
                        <>
                            <div className="w-px h-3 md:h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
                            <span className="text-xs md:text-sm" style={{ color: "#9ca3af" }}>{data.runtime} min</span>
                        </>
                    )}
                    {data.seasons && (
                        <>
                            <div className="w-px h-3 md:h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
                            <span className="text-xs md:text-sm" style={{ color: "#9ca3af" }}>
                                {data.seasons.length} temp.
                            </span>
                        </>
                    )}
                </div>

                {/* Géneros */}
                {data.genres?.length > 0 && (
                    <div className="flex gap-1.5 md:gap-2 flex-wrap">
                        {data.genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="rounded-full px-2.5 md:px-3.5 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold"
                                style={{
                                    background: "rgba(124,58,237,0.1)",
                                    border: "1px solid rgba(168,85,247,0.22)",
                                    color: "#c084fc"
                                }}
                            >
                                {genre.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Añadir a lista */}
                <AddToListDropdown
                    tmdb_id={data.tmdb_id}
                    media_type={mediaType}
                    title={data.title || data.name}
                    poster_path={data.poster_path}
                    vote_average={data.vote_average}
                />

                {/* Sinopsis — oculta en móvil (se mueve abajo) */}
                {data.overview && (
                    <>
                        <div className="h-px hidden md:block" style={{ background: "rgba(255,255,255,0.06)", maxWidth: "640px" }} />
                        <p className="hidden md:block" style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: "1.85", maxWidth: "640px" }}>
                            {data.overview}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

// ─── SINOPSIS MÓVIL ───────────────────────────────────────────────────────────
function MobileOverview({ overview }) {
    if (!overview) return null;
    return (
        <div className="px-4 mb-10 md:hidden">
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: "1.8" }}>
                {overview}
            </p>
        </div>
    );
}

// ─── REPARTO ──────────────────────────────────────────────────────────────────
function Cast({ cast, castRef }) {
    const listRef = useRef(null);

    useEffect(() => {
        const el = castRef?.current;
        if (!el || !cast?.length) return;

        gsap.set(el, { opacity: 0, y: 24 });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
                if (listRef.current) {
                    gsap.fromTo(
                        [...listRef.current.children],
                        { opacity: 0, y: 14 },
                        { opacity: 1, y: 0, duration: 0.45, stagger: 0.035, ease: "power2.out", delay: 0.15 }
                    );
                }
                observer.unobserve(el);
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [cast, castRef]);

    if (!cast?.length) return null;

    return (
        <section ref={castRef} className="px-4 md:px-14 mb-14">
            <SectionTitle>Reparto</SectionTitle>
            <div
                ref={listRef}
                className="flex gap-3 md:gap-4 overflow-x-auto pb-4"
                style={{ scrollbarWidth: "none" }}
            >
                {cast.map((actor) => (
                    <div
                        key={actor.id}
                        className="shrink-0 flex flex-col gap-2 transition-transform duration-200 hover:scale-[1.05]"
                        style={{ width: "88px" }}
                    >
                        {actor.profile_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                alt={actor.name}
                                className="rounded-lg object-cover w-full"
                                style={{ height: "120px", border: "1px solid rgba(168,85,247,0.1)" }}
                            />
                        ) : (
                            <div
                                className="rounded-lg flex items-center justify-center w-full"
                                style={{ height: "120px", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(168,85,247,0.1)" }}
                            >
                                <span style={{ fontSize: "1.5rem", opacity: 0.4 }}>🎭</span>
                            </div>
                        )}
                        <div>
                            <p className="text-white text-[11px] font-semibold leading-tight">{actor.name}</p>
                            <p className="text-[10px] mt-0.5 truncate" style={{ color: "#6b7280" }}>{actor.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ─── PROVIDERS ────────────────────────────────────────────────────────────────
function Providers({ providers, providersRef }) {
    useEffect(() => {
        const el = providersRef?.current;
        if (!el) return;

        gsap.set(el, { opacity: 0, y: 24 });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
                observer.unobserve(el);
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [providersRef]);

    return (
        <section ref={providersRef} className="px-4 md:px-14 mb-14">
            <SectionTitle>Disponible en</SectionTitle>
            {providers?.length > 0 ? (
                <div className="flex gap-2 md:gap-3 flex-wrap">
                    {providers.map((provider) => (
                        <div
                            key={provider.provider_id}
                            className="flex items-center gap-2 md:gap-3 rounded-xl px-3 md:px-4 py-2 md:py-2.5 transition-all duration-200"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.12)" }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "rgba(168,85,247,0.38)";
                                e.currentTarget.style.background = "rgba(124,58,237,0.08)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "rgba(168,85,247,0.12)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                            }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                                alt={provider.provider_name}
                                className="rounded-lg"
                                style={{ width: "30px", height: "30px" }}
                            />
                            <span className="text-xs md:text-sm font-medium" style={{ color: "#e5e7eb" }}>
                                {provider.provider_name}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm" style={{ color: "#4b5563" }}>
                    No disponible en plataformas de streaming en España.
                </p>
            )}
        </section>
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
        if (!data || !infoRef.current) return;
        gsap.fromTo(
            infoRef.current,
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", delay: 0.1 }
        );
    }, [data]);

    useEffect(() => {
        const el = reviewsRef.current;
        if (!el) return;

        gsap.set(el, { opacity: 0, y: 24 });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
                observer.unobserve(el);
            },
            { threshold: 0.05 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [data]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: "#0d1117" }}>
                <div
                    className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }}
                />
                <p className="uppercase tracking-[0.3em] text-xs" style={{ color: "#4b5563" }}>Cargando</p>
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
            <Hero
                trailerKey={data.trailer_key}
                backdropPath={data.backdrop_path}
                title={data.title || data.name}
            />
            <Info data={data} infoRef={infoRef} mediaType={type} />
            <MobileOverview overview={data.overview} />
            <Cast cast={data.cast} castRef={castRef} />
            <Providers providers={data.providers} providersRef={providersRef} />

            <section ref={reviewsRef} className="px-4 md:px-14 mb-20">
                <SectionTitle>Reseñas</SectionTitle>
                <Reviews
                    tmdb_id={data.tmdb_id}
                    media_type={type}
                    title={data.title || data.name}
                    poster_path={data.poster_path}
                    vote_average={data.vote_average}
                />
            </section>
        </div>
    );
}
