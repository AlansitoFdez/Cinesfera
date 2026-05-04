import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useProfile from "../../hooks/useProfile";
import { useAuth } from "../../hooks/UseAuth";

// ─── HEADER ───────────────────────────────────────────────────────────────────
function ProfileHeader({ profile, isOwnProfile, following, followLoading, toggleFollow }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center gap-6 py-16 px-8">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full overflow-hidden border-2"
                style={{ borderColor: "rgba(168,85,247,0.4)" }}>
                <img
                    src={profile.avatar || "/default-avatar.png"}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Username y biografía */}
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-widest uppercase">
                    {profile.username}
                </h1>
                {profile.biography && (
                    <p className="text-sm text-center max-w-md" style={{ color: "#9ca3af" }}>
                        {profile.biography}
                    </p>
                )}
            </div>

            {/* Métricas */}
            <div className="flex gap-12">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xl font-bold text-white">{profile.reviews_count}</span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: "#6b7280" }}>Reseñas</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xl font-bold text-white">{profile.followers_count}</span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: "#6b7280" }}>Seguidores</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xl font-bold text-white">{profile.following_count}</span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: "#6b7280" }}>Siguiendo</span>
                </div>
            </div>

            {/* Botón acción */}
            {isOwnProfile ? (
                <button
                    onClick={() => navigate("/settings")}
                    className="px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-widest"
                    style={{ border: "1px solid rgba(168,85,247,0.4)", color: "#a855f7" }}
                >
                    Editar perfil
                </button>
            ) : (
                // El botón cambia de estilo según si ya sigues al usuario o no
                <button
                    onClick={toggleFollow}
                    disabled={followLoading}
                    className="px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-200"
                    style={following
                        ? { border: "1px solid rgba(168,85,247,0.4)", color: "#a855f7" }
                        : { background: "rgba(168,85,247,0.8)", color: "#ffffff" }
                    }
                >
                    {followLoading ? "..." : following ? "Siguiendo" : "Seguir"}
                </button>
            )}
        </div>
    );
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
function ProfileReviews({ reviews }) {
    const navigate = useNavigate();

    if (!reviews.length) return (
        <p className="text-sm uppercase tracking-widest" style={{ color: "#6b7280" }}>
            Sin reseñas todavía
        </p>
    );

    return (
        <div className="flex flex-col gap-4">
            {reviews.map(review => (
                <div
                    key={review.id}
                    className="flex gap-4 rounded-2xl p-4 cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.1)" }}
                    onClick={() => navigate(`/details/${review.tmdb?.media_type}/${review.tmdb_id}`)}
                >
                    <img
                        src={`https://image.tmdb.org/t/p/w92${review.tmdb?.poster_path}`}
                        alt={review.tmdb?.title}
                        className="w-12 rounded-lg shrink-0 object-cover"
                    />
                    <div className="flex flex-col gap-1">
                        <span className="text-white font-semibold text-sm">{review.tmdb?.title}</span>
                        <span className="text-xs" style={{ color: "#a855f7" }}>
                            {"★".repeat(review.rating)} {review.rating}/10
                        </span>
                        {review.comment && (
                            <p className="text-xs line-clamp-2" style={{ color: "#9ca3af" }}>
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
        <p className="text-sm uppercase tracking-widest" style={{ color: "#6b7280" }}>
            Sin favoritos todavía
        </p>
    );

    return (
        <div className="grid grid-cols-4 gap-3">
            {favorites.map(item => (
                <img
                    key={`${item.tmdb_id}-${item.media_type}`}
                    src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                    alt={item.title}
                    className="w-full rounded-xl cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => navigate(`/details/${item.media_type}/${item.tmdb_id}`)}
                />
            ))}
        </div>
    );
}

// ─── SECCIÓN TÍTULO ───────────────────────────────────────────────────────────
function SectionTitle({ children }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-black text-white uppercase tracking-widest shrink-0"
                style={{ fontFamily: "'Georgia', serif" }}>
                {children}
            </h2>
            <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.15)" }} />
        </div>
    );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Profile() {
    const { username } = useParams();
    const { user } = useAuth();

    const isOwnProfile = user?.username === username;

    // Solo pasamos currentUserId si NO es nuestro propio perfil
    // Así evitamos llamar a /follow/status/:username innecesariamente
    const { profile, reviews, favorites, loading, error, following, followLoading, toggleFollow } =
        useProfile(username, isOwnProfile ? null : user?.sub);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [username]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p className="uppercase tracking-widest text-sm" style={{ color: "#6b7280" }}>Cargando perfil...</p>
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p style={{ color: "#f87171", fontSize: "0.9rem" }}>Usuario no encontrado.</p>
        </div>
    );

    return (
        <div className="min-h-screen px-8 md:px-24 pb-24" style={{ background: "#0d1117" }}>
            <ProfileHeader
                profile={profile}
                isOwnProfile={isOwnProfile}
                following={following}
                followLoading={followLoading}
                toggleFollow={toggleFollow}
            />

            <div className="flex flex-col gap-16 max-w-3xl mx-auto">
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