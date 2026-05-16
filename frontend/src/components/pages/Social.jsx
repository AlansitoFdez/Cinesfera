import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import useSocial from "../../hooks/useSocial";

const TABS = [
    { key: "friends",   label: "Amigos"     },
    { key: "followers", label: "Te siguen"  },
    { key: "discover",  label: "Descubrir"  },
];

// ─── AVATAR CON ANILLO ────────────────────────────────────────────────────────
function RingAvatar({ src, alt, size = 48 }) {
    return (
        <div
            className="rounded-full shrink-0 p-[2px]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", width: size + 4, height: size + 4 }}
        >
            <div className="rounded-full overflow-hidden w-full h-full" style={{ background: "#0d1117" }}>
                <img
                    src={src || "/default-avatar.png"}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function TabBar({ activeTab, setActiveTab, counts }) {
    return (
        <div
            className="flex gap-1 rounded-xl p-1 mb-10"
            style={{ background: "rgba(255,255,255,0.04)" }}
        >
            {TABS.map(tab => {
                const active = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-250 flex items-center justify-center gap-2"
                        style={active
                            ? { background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(168,85,247,0.4))", color: "#e9d5ff" }
                            : { color: "#6b7280" }
                        }
                    >
                        {tab.label}
                        {counts[tab.key] > 0 && (
                            <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden sm:inline"
                                style={{
                                    background: active ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.07)",
                                    color: active ? "#e9d5ff" : "#4b5563"
                                }}
                            >
                                {counts[tab.key]}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

// ─── TARJETA DE AMIGO ─────────────────────────────────────────────────────────
function FriendCard({ friend }) {
    const navigate = useNavigate();

    return (
        <div
            className="rounded-xl p-4 flex flex-col gap-4 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.08)" }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)";
                e.currentTarget.style.background = "rgba(124,58,237,0.05)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
        >
            {/* Cabecera */}
            <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/profile/${friend.username}`)}
            >
                <RingAvatar src={friend.avatar} alt={friend.username} size={44} />

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-white font-semibold text-sm truncate">
                        @{friend.username}
                    </span>
                    {friend.biography && (
                        <span className="text-xs truncate leading-relaxed" style={{ color: "#6b7280" }}>
                            {friend.biography}
                        </span>
                    )}
                    <div className="flex gap-4 mt-0.5">
                        <span className="text-xs" style={{ color: "#4b5563" }}>
                            <span className="text-white font-semibold">{friend.followers_count}</span> seg.
                        </span>
                        <span className="text-xs" style={{ color: "#4b5563" }}>
                            <span className="text-white font-semibold">{friend.following_count}</span> siguiendo
                        </span>
                    </div>
                </div>
            </div>

            {/* Preview favoritos */}
            {friend.favorites?.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-[2px] h-3 rounded-full" style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: "#4b5563" }}>Favoritos</span>
                    </div>
                    <div className="flex gap-2">
                        {friend.favorites.map(item => (
                            <div
                                key={`${item?.tmdb_id}-${item?.media_type}`}
                                className="rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105"
                                style={{
                                    width: "44px",
                                    aspectRatio: "2/3",
                                    border: "1px solid rgba(168,85,247,0.1)"
                                }}
                                onClick={() => navigate(`/details/${item?.media_type}/${item?.tmdb_id}`)}
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w92${item?.poster_path}`}
                                    alt={item?.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <span className="text-xs" style={{ color: "#374151" }}>Sin favoritos todavía</span>
            )}
        </div>
    );
}

// ─── TARJETA DE USUARIO SIMPLE ────────────────────────────────────────────────
function UserCard({ user, onFollow }) {
    const navigate = useNavigate();

    return (
        <div
            className="rounded-xl p-4 flex items-center gap-4 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.08)" }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.25)";
                e.currentTarget.style.background = "rgba(124,58,237,0.05)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(168,85,247,0.08)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
        >
            <div
                className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/profile/${user.username}`)}
            >
                <RingAvatar src={user.avatar} alt={user.username} size={44} />

                <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-white font-semibold text-sm truncate">
                        @{user.username}
                    </span>
                    {user.biography && (
                        <span className="text-xs truncate" style={{ color: "#6b7280" }}>
                            {user.biography}
                        </span>
                    )}
                    {user.followers_count !== undefined && (
                        <span className="text-xs" style={{ color: "#4b5563" }}>
                            <span className="text-white font-semibold">{user.followers_count}</span> seguidores
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={() => onFollow(user.username)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white shrink-0 transition-all duration-200 hover:scale-[1.04]"
                style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                    boxShadow: "0 0 14px rgba(124,58,237,0.3)"
                }}
            >
                Seguir
            </button>
        </div>
    );
}

// ─── ESTADO VACÍO ─────────────────────────────────────────────────────────────
function EmptyState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span style={{ fontSize: "2.2rem", opacity: 0.2 }}>🎬</span>
            <p className="text-sm text-center" style={{ color: "#4b5563" }}>{message}</p>
        </div>
    );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Social() {
    const { friends, followers, suggested, loading, activeTab, setActiveTab, handleFollow } = useSocial();
    const listRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Stagger de cards al cambiar pestaña
    useEffect(() => {
        if (loading || !listRef.current) return;
        const cards = [...listRef.current.children];
        if (!cards.length) return;
        gsap.fromTo(
            cards,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }
        );
    }, [activeTab, loading]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-5" style={{ background: "#0d1117" }}>
            <div
                className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#7c3aed #7c3aed #7c3aed transparent" }}
            />
            <p className="uppercase tracking-[0.3em] text-xs" style={{ color: "#4b5563" }}>Cargando</p>
        </div>
    );

    const counts = {
        friends: friends.length,
        followers: followers.length,
        discover: suggested.length
    };

    const activeList =
        activeTab === "friends"   ? friends   :
        activeTab === "followers" ? followers :
        suggested;

    const emptyMessages = {
        friends:   "Todavía no tienes amigos mutuos",
        followers: "Nadie te sigue todavía que no sigas de vuelta",
        discover:  "Ya sigues a todo el mundo"
    };

    return (
        <div className="min-h-screen pb-24 pt-28 px-4 sm:px-8 md:px-24" style={{ background: "#0d1117" }}>

            {/* Header */}
            <div className="flex items-center gap-3 mb-10 max-w-2xl mx-auto">
                <div
                    className="w-[3px] h-7 rounded-full shrink-0"
                    style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }}
                />
                <h1 className="text-3xl font-bold text-white">Social</h1>
            </div>

            <div className="max-w-2xl mx-auto">
                <TabBar activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

                {activeList.length === 0 ? (
                    <EmptyState message={emptyMessages[activeTab]} />
                ) : (
                    <div ref={listRef} className="flex flex-col gap-3">
                        {activeList.map(item =>
                            activeTab === "friends"
                                ? <FriendCard key={item.id} friend={item} />
                                : <UserCard key={item.id} user={item} onFollow={handleFollow} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
