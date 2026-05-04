import { useState, useEffect } from "react";
import api from "../api";

export default function useSocial() {
    const [friends, setFriends] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [suggested, setSuggested] = useState([]);
    const [loading, setLoading] = useState(true);

    // Control de qué pestaña está activa — arrancamos en "friends"
    const [activeTab, setActiveTab] = useState("friends");

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                // Las tres llamadas en paralelo
                const [resFriends, resFollowers, resSuggested] = await Promise.all([
                    api.get("/follow/friends"),
                    api.get("/follow/followers"),
                    api.get("/follow/discover"),
                ]);
                setFriends(resFriends.datos);
                setFollowers(resFollowers.datos);
                setSuggested(resSuggested.datos);
            } catch (err) {
                console.error("Error al cargar datos sociales:", err);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    // Seguir a alguien desde la pestaña Followers o Discover
    // Después de seguir, lo movemos de lista para reflejar el cambio en UI
    const handleFollow = async (username) => {
        try {
            await api.post(`/follow/${username}`);

            // Lo quitamos de la lista en la que estaba
            setFollowers(prev => prev.filter(u => u.username !== username));
            setSuggested(prev => prev.filter(u => u.username !== username));
        } catch (err) {
            console.error("Error al seguir:", err);
        }
    };

    return { friends, followers, suggested, loading, activeTab, setActiveTab, handleFollow };
}