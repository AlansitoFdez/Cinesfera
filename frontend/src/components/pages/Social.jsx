import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import useSocial from "../../hooks/useSocial";

const TABS = [
    { key: "friends",   label: "Amigos"    },
    { key: "followers", label: "Te siguen" },
    { key: "discover",  label: "Descubrir" },
];

// ─── AVATAR CON ANILLO ────────────────────────────────────────────────────────
function RingAvatar({ src, alt, size = 48 }) {
    return (
        <div
            className="rounded-full shrink-0 p-[2px]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", width: size + 4, height: size + 4 }}
        >
            <div className="rounded-full overflow-hidden w-full h-full" style={{ background: "#060810" }}>
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
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
            {TABS.map(tab => {
                const active = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                        style={active
                            ? { background: "linear-gradient(135deg, #6d28d9, #9333ea)", color: "#fff", boxShadow: "0 0 16px rgba(109,40,217,0.3)" }
                            : { color: "#4b5563" }
                        }
                        onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#9ca3af"; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#4b5563"; }}
                    >
                        {tab.label}
                        {counts[tab.key] > 0 && (
                            <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden sm:inline"
                                style={{
                                    background: active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)",
                                    color:      active ? "#fff" : "#374151"
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
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                e.currentTarget.style.background  = "rgba(109,40,217,0.07)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.background  = "rgba(255,255,255,0.025)";
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
                        <span className="text-xs" style={{ color: "#374151" }}>
                            <span className="text-white font-semibold">{friend.followers_count}</span> seg.
                        </span>
                        <span className="text-xs" style={{ color: "#374151" }}>
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
                        <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "#374151" }}>
                            Favoritos
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {friend.favorites.map(item => (
                            <div
                                key={`${item?.tmdb_id}-${item?.media_type}`}
                                className="rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105"
                                style={{
                                    width: "44px",
                                    aspectRatio: "2/3",
                                    border: "1px solid rgba(124,58,237,0.15)"
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
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                e.currentTarget.style.background  = "rgba(109,40,217,0.07)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.background  = "rgba(255,255,255,0.025)";
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
                        <span className="text-xs" style={{ color: "#374151" }}>
                            <span className="text-white font-semibold">{user.followers_count}</span> seguidores
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={() => onFollow(user.username)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white shrink-0 transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
                style={{
                    background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                    boxShadow: "0 0 16px rgba(109,40,217,0.35)"
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
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.25)" strokeWidth="1.2">
                <circle cx="9"  cy="7"  r="4" />
                <circle cx="17" cy="7"  r="3" />
                <path d="M1 21c0-4 3.6-7 8-7" />
                <path d="M14 21c0-3.3 2.7-6 6-6" />
            </svg>
            <p className="text-sm text-center" style={{ color: "#374151" }}>{message}</p>
        </div>
    );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function Social() {
    const { friends, followers, suggested, loading, activeTab, setActiveTab, handleFollow } = useSocial();
    const headerRef = useRef(null);
    const listRef   = useRef(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        if (!headerRef.current) return;
        gsap.fromTo(headerRef.current,
            { opacity: 0, y: 22, filter: "blur(4px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }
        );
    }, []);

    useEffect(() => {
        if (loading || !listRef.current) return;
        const cards = [...listRef.current.children];
        if (!cards.length) return;
        gsap.fromTo(cards,
            { opacity: 0, y: 16, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.07, ease: "power2.out" }
        );
    }, [activeTab, loading]);

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

    const counts = {
        friends:   friends.length,
        followers: followers.length,
        discover:  suggested.length
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
        <div className="min-h-screen pb-24 pt-28 px-4 sm:px-8 md:px-24" style={{ background: "#060810" }}>

            {/* Header */}
            <div ref={headerRef} className="flex items-center gap-3 mb-10 max-w-2xl mx-auto relative">
                <div
                    className="absolute -top-6 -left-4 w-48 h-48 pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(109,40,217,0.07) 0%, transparent 70%)", borderRadius: "50%" }}
                />
                <div className="w-[3px] h-7 rounded-full shrink-0 relative z-10"
                    style={{ background: "linear-gradient(to bottom, #7c3aed, #a855f7)" }} />
                <h1 className="text-3xl font-black text-white tracking-tight relative z-10">Social</h1>
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
                                : <UserCard   key={item.id} user={item}   onFollow={handleFollow} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
