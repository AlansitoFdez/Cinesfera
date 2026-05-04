import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useSocial from "../../hooks/useSocial";

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
    { key: "friends",   label: "Amigos"    },
    { key: "followers", label: "Te siguen" },
    { key: "discover",  label: "Descubrir" },
];

function TabBar({ activeTab, setActiveTab }) {
    return (
        <div className="flex gap-1 rounded-xl p-1 mb-10"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            {TABS.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="flex-1 py-2 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-300"
                    style={activeTab === tab.key
                        ? { background: "rgba(168,85,247,0.2)", color: "#a855f7" }
                        : { color: "#6b7280" }
                    }
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// ─── TARJETA DE AMIGO (con favoritos) ─────────────────────────────────────────
function FriendCard({ friend }) {
    const navigate = useNavigate();

    return (
        <div
            className="rounded-2xl p-5 flex flex-col gap-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.1)" }}
        >
            {/* Cabecera: avatar + datos */}
            <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/profile/${friend.username}`)}
            >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border"
                    style={{ borderColor: "rgba(168,85,247,0.3)" }}>
                    <img
                        src={friend.avatar || "/default-avatar.png"}
                        alt={friend.username}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-white font-bold text-sm tracking-wide uppercase truncate">
                        {friend.username}
                    </span>
                    {friend.biography && (
                        <span className="text-xs truncate" style={{ color: "#9ca3af" }}>
                            {friend.biography}
                        </span>
                    )}
                    <div className="flex gap-4">
                        <span className="text-xs" style={{ color: "#6b7280" }}>
                            <span className="text-white font-semibold">{friend.followers_count}</span> seguidores
                        </span>
                        <span className="text-xs" style={{ color: "#6b7280" }}>
                            <span className="text-white font-semibold">{friend.following_count}</span> siguiendo
                        </span>
                    </div>
                </div>
            </div>

            {/* Preview de favoritos */}
            {friend.favorites && friend.favorites.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-widest" style={{ color: "#6b7280" }}>
                        Favoritos
                    </span>
                    <div className="flex gap-2">
                        {friend.favorites.map(item => (
                            <img
                                key={`${item?.tmdb_id}-${item?.media_type}`}
                                src={`https://image.tmdb.org/t/p/w92${item?.poster_path}`}
                                alt={item?.title}
                                className="w-10 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => navigate(`/details/${item?.media_type}/${item?.tmdb_id}`)}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <span className="text-xs uppercase tracking-widest" style={{ color: "#4b5563" }}>
                    Sin favoritos todavía
                </span>
            )}
        </div>
    );
}

// ─── TARJETA DE USUARIO SIMPLE (followers + discover) ────────────────────────
function UserCard({ user, onFollow }) {
    const navigate = useNavigate();

    return (
        <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.1)" }}
        >
            {/* Avatar + datos — clicable al perfil */}
            <div
                className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/profile/${user.username}`)}
            >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border"
                    style={{ borderColor: "rgba(168,85,247,0.3)" }}>
                    <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.username}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-white font-bold text-sm tracking-wide uppercase truncate">
                        {user.username}
                    </span>
                    {user.biography && (
                        <span className="text-xs truncate" style={{ color: "#9ca3af" }}>
                            {user.biography}
                        </span>
                    )}
                    {user.followers_count !== undefined && (
                        <span className="text-xs" style={{ color: "#6b7280" }}>
                            <span className="text-white font-semibold">{user.followers_count}</span> seguidores
                        </span>
                    )}
                </div>
            </div>

            {/* Botón seguir */}
            <button
                onClick={() => onFollow(user.username)}
                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-white shrink-0"
                style={{ background: "rgba(168,85,247,0.8)" }}
            >
                Seguir
            </button>
        </div>
    );
}

// ─── ESTADO VACÍO ─────────────────────────────────────────────────────────────
function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-4xl">🎬</span>
            <p className="text-sm uppercase tracking-widest text-center" style={{ color: "#6b7280" }}>
                {message}
            </p>
        </div>
    );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Social() {
    const { friends, followers, suggested, loading, activeTab, setActiveTab, handleFollow } = useSocial();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1117" }}>
            <p className="uppercase tracking-widest text-sm" style={{ color: "#6b7280" }}>Cargando...</p>
        </div>
    );

    return (
        <div className="min-h-screen px-8 md:px-24 pb-24 pt-28" style={{ background: "#0d1117" }}>
            {/* Título */}
            <div className="flex items-center gap-4 mb-10 max-w-2xl mx-auto">
                <h1 className="text-2xl font-black text-white uppercase tracking-widest shrink-0"
                    style={{ fontFamily: "'Georgia', serif" }}>
                    Social
                </h1>
                <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.15)" }} />
            </div>

            <div className="max-w-2xl mx-auto">
                <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* ── Pestaña Amigos ── */}
                {activeTab === "friends" && (
                    friends.length === 0
                        ? <EmptyState message="Todavía no tienes amigos mutuos" />
                        : <div className="flex flex-col gap-4">
                            {friends.map(friend => (
                                <FriendCard key={friend.id} friend={friend} />
                            ))}
                        </div>
                )}

                {/* ── Pestaña Te siguen ── */}
                {activeTab === "followers" && (
                    followers.length === 0
                        ? <EmptyState message="Nadie te sigue todavía que no sigas de vuelta" />
                        : <div className="flex flex-col gap-4">
                            {followers.map(user => (
                                <UserCard key={user.id} user={user} onFollow={handleFollow} />
                            ))}
                        </div>
                )}

                {/* ── Pestaña Descubrir ── */}
                {activeTab === "discover" && (
                    suggested.length === 0
                        ? <EmptyState message="Ya sigues a todo el mundo" />
                        : <div className="flex flex-col gap-4">
                            {suggested.map(user => (
                                <UserCard key={user.id} user={user} onFollow={handleFollow} />
                            ))}
                        </div>
                )}
            </div>
        </div>
    );
}