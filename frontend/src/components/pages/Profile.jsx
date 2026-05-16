import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import useProfile from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";

// ─── HEADER ───────────────────────────────────────────────────────────────────
function ProfileHeader({ profile, isOwnProfile, following, followLoading, toggleFollow }) {
    const navigate = useNavigate();
    const contentRef = useRef(null);

    useEffect(() => {
        if (!contentRef.current) return;
        gsap.fromTo(
            [...contentRef.current.children],
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.1 }
        );
    }, []);

    const METRICS = [
        { value: profile.reviews_count, label: "Reseñas" },
        { value: profile.followers_count, label: "Seguidores" },
        { value: profile.following_count, label: "Siguiendo" },
    ];

    return (
        <div className="relative flex flex-col items-center pb-0 overflow-hidden">
            {/* Fondo radial sutil */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,58,237,0.07) 0%, transparent 100%)"
                }}
            />

            <div ref={contentRef} className="relative z-10 flex flex-col items-center gap-6 pt-28 pb-10 px-8">
                {/* Avatar con anillo degradado */}
                <div
                    className="p-[2.5px] rounded-full"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                >
                    <div
                        className="rounded-full overflow-hidden"
                        style={{ width: "112px", height: "112px", background: "#0d1117" }}
                    >
                        <img
                            src={profile.avatar || "/default-avatar.png"}
                            alt={profile.username}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Nombre y bio */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold text-white">
                        @{profile.username}
                    </h1>
                    {profile.biography && (
                        <p
                            className="text-sm leading-relaxed"
                            style={{ color: "#9ca3af", maxWidth: "36ch" }}
                        >
                            {profile.biography}
                        </p>
                    )}
                </div>

                {/* Métricas en pill */}
                <div
                    className="flex items-center rounded-2xl"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(168,85,247,0.1)"
                    }}
                >
                    {METRICS.map((m, i) => (
                        <div key={m.label} className="flex items-center">
                            <div className="flex flex-col items-center gap-0.5 px-4 sm:px-7 py-3">
                                <span className="text-xl font-bold text-white">{m.value}</span>
                                <span
                                    className="text-[10px] uppercase tracking-wider"
                                    style={{ color: "#6b7280" }}
                                >
                                    {m.label}
                                </span>
                            </div>
                            {i < METRICS.length - 1 && (
                                <div
                                    className="h-8 w-px"
                                    style={{ background: "rgba(255,255,255,0.06)" }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                {isOwnProfile ? (
                    <button
                        onClick={() => navigate("/settings")}
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-white/10"
                        style={{
                            border: "1px solid rgba(168,85,247,0.3)",
                            color: "#c084fc",
                            backdropFilter: "blur(8px)"
                        }}
                    >
                        Editar perfil
                    </button>
                ) : (
                    <button
                        onClick={toggleFollow}
                        disabled={followLoading}
                        className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                        style={following
                            ? {
                                border: "1px solid rgba(168,85,247,0.3)",
                                color: "#c084fc",
                                backdropFilter: "blur(8px)"
                            }
                            : {
                                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                                color: "#fff",
                                boxShadow: "0 0 20px rgba(124,58,237,0.35)"
                            }
                        }
                    >
                        {followLoading ? "..." : following ? "Siguiendo" : "Seguir"}
                    </button>
                )}
            </div>

            {/* Divisor */}
            <div
                className="w-full h-px"
                style={{
                    background: "linear-gradient(to right, transparent, rgba(168,85,247,0.1) 30%, rgba(168,85,247,0.1) 70%, transparent)"
                }}
            />
        </div>
    );
}

// ─── TÍTULO DE SECCIÓN ────────────────────────────────────────────────────────
function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-3 mb-6">
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

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
function ProfileReviews({ reviews }) {
    const navigate = useNavigate();

    if (!reviews.length) return (
        <p className="text-sm" style={{ color: "#4b5563" }}>Sin reseñas todavía.</p>
    );

    return (
        <div className="flex flex-col gap-3">
            {reviews.map(review => (
                <div
                    key={review.id}
                    className="flex gap-4 rounded-xl p-4 cursor-pointer transition-all duration-200"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(168,85,247,0.08)"
                    }}
                    onClick={() => navigate(`/details/${review.tmdb?.media_type}/${review.tmdb_id}`)}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "rgba(168,85,247,0.28)";
                        e.currentTarget.style.background = "rgba(124,58,237,0.06)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "rgba(168,85,247,0.08)";
                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }}
                >
                    {/* Póster */}
                    <div className="shrink-0 rounded-lg overflow-hidden" style={{ width: "44px", aspectRatio: "2/3" }}>
                        <img
                            src={`https://image.tmdb.org/t/p/w92${review.tmdb?.poster_path}`}
                            alt={review.tmdb?.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-white font-semibold text-sm truncate">
                            {review.tmdb?.title}
                        </span>
                        <div className="flex items-center gap-1">
                            <span style={{ color: "#eab308", fontSize: "11px" }}>★</span>
                            <span className="text-xs font-semibold" style={{ color: "#c084fc" }}>
                                {review.rating}/10
                            </span>
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

// ─── FAVORITOS ────────────────────────────────────────────────────────────────
function ProfileFavorites({ favorites }) {
    const navigate = useNavigate();

    if (!favorites.length) return (
        <p className="text-sm" style={{ color: "#4b5563" }}>Sin favoritos todavía.</p>
    );

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {favorites.map(item => (
                <div
                    key={`${item.tmdb_id}-${item.media_type}`}
                    className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200"
                    style={{ aspectRatio: "2/3" }}
                    onClick={() => navigate(`/details/${item.media_type}/${item.tmdb_id}`)}
                    onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = "0 0 0 1px rgba(168,85,247,0.5), 0 8px 24px rgba(124,58,237,0.2)";
                        e.currentTarget.style.transform = "scale(1.04)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "scale(1)";
                    }}
                >
                    <img
                        src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                </div>
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
        <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: "#0d1117" }}>
            <div
                className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }}
            />
            <p className="uppercase tracking-[0.3em] text-xs" style={{ color: "#4b5563" }}>Cargando</p>
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>Usuario no encontrado.</p>
        </div>
    );

    return (
        <div className="min-h-screen pb-24" style={{ background: "#0d1117" }}>
            <ProfileHeader
                profile={profile}
                isOwnProfile={isOwnProfile}
                following={following}
                followLoading={followLoading}
                toggleFollow={toggleFollow}
            />

            <div className="flex flex-col gap-14 max-w-3xl mx-auto px-8 pt-14">
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
