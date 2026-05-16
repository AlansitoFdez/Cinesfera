import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import useProfile from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";

// ─── HEADER ───────────────────────────────────────────────────────────────────
function ProfileHeader({ profile, isOwnProfile, following, followLoading, toggleFollow }) {
    const navigate = useNavigate();
    const avatarRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!avatarRef.current || !contentRef.current) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(avatarRef.current,
                { scale: 0.78, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.95, ease: "back.out(1.5)", delay: 0.1 }
            );
            gsap.fromTo(
                [...contentRef.current.children],
                { opacity: 0, y: 26, filter: "blur(4px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.75, stagger: 0.11, ease: "power3.out", delay: 0.4 }
            );
        });
        return () => ctx.revert();
    }, []);

    const METRICS = [
        { value: profile.reviews_count, label: "Reseñas" },
        { value: profile.followers_count, label: "Seguidores" },
        { value: profile.following_count, label: "Siguiendo" },
    ];

    return (
        <div className="relative flex flex-col items-center overflow-hidden">
            {/* Backdrop morado + grano */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: "linear-gradient(180deg, rgba(109,40,217,0.1) 0%, rgba(6,8,16,0) 65%)"
            }} />
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                opacity: 0.55, mixBlendMode: "overlay"
            }} />

            {/* Avatar */}
            <div ref={avatarRef} className="relative mt-28 mb-5">
                {/* Glow */}
                <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                    background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)",
                    filter: "blur(14px)",
                    transform: "scale(1.4)"
                }} />
                {/* Anillo doble */}
                <div className="p-[2px] rounded-full" style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc, #7c3aed)" }}>
                    <div className="p-[2.5px] rounded-full" style={{ background: "#060810" }}>
                        <div className="rounded-full overflow-hidden" style={{ width: "120px", height: "120px" }}>
                            <img
                                src={profile.avatar || "/default-avatar.png"}
                                alt={profile.username}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div ref={contentRef} className="flex flex-col items-center gap-5 pb-10 px-8 w-full max-w-lg">
                {/* Nombre y bio */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        @{profile.username}
                    </h1>
                    {profile.biography && (
                        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af", maxWidth: "38ch" }}>
                            {profile.biography}
                        </p>
                    )}
                </div>

                {/* Métricas */}
                <div className="flex items-center justify-center">
                    {METRICS.map((m, i) => (
                        <div key={m.label} className="flex items-center">
                            <div className="flex flex-col items-center gap-0.5 px-5 sm:px-8 py-3 rounded-xl transition-colors duration-200 hover:bg-white/3 cursor-default">
                                <span className="text-2xl font-black text-white">{m.value}</span>
                                <span className="text-[10px] uppercase tracking-widest" style={{ color: "#4b5563" }}>
                                    {m.label}
                                </span>
                            </div>
                            {i < METRICS.length - 1 && (
                                <div className="h-8 w-px mx-1" style={{ background: "rgba(255,255,255,0.05)" }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                {isOwnProfile ? (
                    <button
                        onClick={() => navigate("/settings")}
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white/10 hover:scale-[1.03] active:scale-[0.97]"
                        style={{ border: "1px solid rgba(168,85,247,0.28)", color: "#c084fc", backdropFilter: "blur(8px)" }}
                    >
                        Editar perfil
                    </button>
                ) : (
                    <button
                        onClick={toggleFollow}
                        disabled={followLoading}
                        className="px-7 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                        style={following
                            ? { border: "1px solid rgba(168,85,247,0.28)", color: "#c084fc", backdropFilter: "blur(8px)" }
                            : { background: "linear-gradient(135deg, #6d28d9, #9333ea)", color: "#fff", boxShadow: "0 0 24px rgba(109,40,217,0.45)" }
                        }
                    >
                        {followLoading ? "..." : following ? "Siguiendo" : "Seguir"}
                    </button>
                )}
            </div>

            {/* Divisor */}
            <div className="w-full h-px" style={{
                background: "linear-gradient(to right, transparent, rgba(124,58,237,0.12) 30%, rgba(124,58,237,0.12) 70%, transparent)"
            }} />
        </div>
    );
}

// ─── TÍTULO DE SECCIÓN ────────────────────────────────────────────────────────
function SectionTitle({ children }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 14 });
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            gsap.to(el, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" });
            observer.unobserve(el);
        }, { threshold: 0.1 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="flex items-center gap-3 mb-6">
            <div className="w-[3px] h-5 rounded-full shrink-0" style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
            <h2 className="text-base font-semibold tracking-wide" style={{ color: "#e5e7eb" }}>
                {children}
            </h2>
        </div>
    );
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
function ProfileReviews({ reviews }) {
    const navigate = useNavigate();
    const listRef = useRef(null);

    useEffect(() => {
        const el = listRef.current;
        if (!el || !reviews.length) return;
        gsap.set([...el.children], { opacity: 0, y: 18 });
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            gsap.to([...el.children], { opacity: 1, y: 0, duration: 0.55, stagger: 0.09, ease: "power2.out" });
            observer.unobserve(el);
        }, { threshold: 0.05 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [reviews]);

    if (!reviews.length) return (
        <p className="text-sm" style={{ color: "#374151" }}>Sin reseñas todavía.</p>
    );

    return (
        <div ref={listRef} className="flex flex-col gap-2.5">
            {reviews.map(review => (
                <div
                    key={review.id}
                    className="flex gap-4 rounded-xl p-4 cursor-pointer transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
                    onClick={() => navigate(`/details/${review.tmdb?.media_type}/${review.tmdb_id}`)}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                        e.currentTarget.style.background = "rgba(109,40,217,0.07)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                    }}
                >
                    {/* Póster */}
                    <div className="shrink-0 rounded-lg overflow-hidden" style={{ width: "52px", aspectRatio: "2/3" }}>
                        <img
                            src={`https://image.tmdb.org/t/p/w92${review.tmdb?.poster_path}`}
                            alt={review.tmdb?.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center gap-1.5 min-w-0">
                        <span className="text-white font-semibold text-sm truncate">
                            {review.tmdb?.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span style={{ color: "#eab308", fontSize: "10px" }}>★</span>
                            <span className="text-xs font-bold" style={{ color: "#c084fc" }}>{review.rating}</span>
                            <span className="text-[10px]" style={{ color: "#374151" }}>/10</span>
                        </div>
                        {review.comment && (
                            <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "#6b7280" }}>
                                {review.comment}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── FAVORITO (item individual con GSAP) ─────────────────────────────────────
function FavoriteItem({ item, navigate }) {
    const cardRef = useRef(null);
    const overlayRef = useRef(null);

    useLayoutEffect(() => {
        gsap.set(overlayRef.current, { opacity: 0 });
    }, []);

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, { scale: 1.04, duration: 0.3, ease: "power2.out" });
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.25, ease: "power2.out" });
        cardRef.current.style.boxShadow = "0 0 0 1.5px rgba(124,58,237,0.5), 0 8px 24px rgba(109,40,217,0.2)";
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, ease: "power2.in" });
        cardRef.current.style.boxShadow = "none";
    };

    return (
        <div
            ref={cardRef}
            className="relative overflow-hidden rounded-xl cursor-pointer"
            style={{ aspectRatio: "2/3", transition: "box-shadow 0.3s ease", background: "#0e0f14" }}
            onClick={() => navigate(`/details/${item.media_type}/${item.tmdb_id}`)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                alt={item.title}
                className="w-full h-full object-cover"
            />
            <div
                ref={overlayRef}
                className="absolute inset-0 flex flex-col justify-end p-2.5"
                style={{ background: "linear-gradient(to top, rgba(6,8,16,0.96) 0%, rgba(6,8,16,0.5) 40%, transparent 100%)" }}
            >
                <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2">{item.title}</p>
            </div>
        </div>
    );
}

// ─── FAVORITOS ────────────────────────────────────────────────────────────────
function ProfileFavorites({ favorites }) {
    const navigate = useNavigate();
    const gridRef = useRef(null);

    useEffect(() => {
        const el = gridRef.current;
        if (!el || !favorites.length) return;
        gsap.set([...el.children], { opacity: 0, scale: 0.9 });
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            gsap.to([...el.children], { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.2)" });
            observer.unobserve(el);
        }, { threshold: 0.05 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [favorites]);

    if (!favorites.length) return (
        <p className="text-sm" style={{ color: "#374151" }}>Sin favoritos todavía.</p>
    );

    return (
        <div ref={gridRef} className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {favorites.map(item => (
                <FavoriteItem
                    key={`${item.tmdb_id}-${item.media_type}`}
                    item={item}
                    navigate={navigate}
                />
            ))}
        </div>
    );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Profile() {
    const { username } = useParams();
    const { user } = useAuth();
    const isOwnProfile = user?.username === username;

    const { profile, reviews, favorites, loading, error, following, followLoading, toggleFollow } =
        useProfile(username, isOwnProfile ? null : user?.sub);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [username]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "#060810" }}>
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(124,58,237,0.15)" }} />
                <div className="absolute inset-0 rounded-full animate-spin" style={{ borderTop: "1.5px solid #7c3aed", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent" }} />
                <div className="absolute inset-2 rounded-full animate-spin" style={{ borderTop: "1.5px solid rgba(168,85,247,0.4)", borderRight: "1.5px solid transparent", borderBottom: "1.5px solid transparent", borderLeft: "1.5px solid transparent", animationDuration: "1.5s", animationDirection: "reverse" }} />
            </div>
            <div className="flex flex-col items-center gap-1">
                <p className="uppercase tracking-[0.4em] text-[10px] font-semibold" style={{ color: "#6d28d9" }}>Cinesfera</p>
                <p className="uppercase tracking-[0.2em] text-[9px]" style={{ color: "#1f2937" }}>Cargando</p>
            </div>
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#060810" }}>
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>Usuario no encontrado.</p>
        </div>
    );

    return (
        <div className="min-h-screen pb-24" style={{ background: "#060810" }}>
            <ProfileHeader
                profile={profile}
                isOwnProfile={isOwnProfile}
                following={following}
                followLoading={followLoading}
                toggleFollow={toggleFollow}
            />
            <div className="flex flex-col gap-14 max-w-3xl mx-auto px-6 sm:px-8 pt-14">
                <section>
                    <SectionTitle>Últimas reseñas</SectionTitle>
                    <ProfileReviews reviews={reviews} />
                </section>
                <section>
                    <SectionTitle>Favoritos</SectionTitle>
                    <ProfileFavorites favorites={favorites} />
                </section>
            </div>
        </div>
    );
}
