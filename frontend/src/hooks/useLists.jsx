import { useState, useEffect} from "react"
import api from "../api"

export function useLists() {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    const cargarListas = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/lists");
            setLists(res.datos);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
 
    useEffect(() => {
        cargarListas();
    }, []);
 
    const createList = async ({ name, description, is_public }) => {
        const res = await api.post("/lists", { name, description, is_public });
        setLists(prev => [...prev, { ...res.datos, item_count: 0 }]);
        return res.datos;
    };
 
    const updateList = async (listId, data) => {
        const res = await api.put(`/lists/${listId}`, data);
        setLists(prev => prev.map(l => l.id === listId ? { ...l, ...res.datos } : l));
        return res.datos;
    };
 
    const deleteList = async (listId) => {
        await api.delete(`/lists/${listId}`);
        setLists(prev => prev.filter(l => l.id !== listId));
    };
 
    return { lists, loading, error, createList, updateList, deleteList };
}

export function useListDetail(listId) {
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        if (!listId) return;
        const cargar = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/lists/${listId}`);
                setList(res.datos);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [listId]);
 
    const removeItem = async (tmdb_id, media_type) => {
        await api.post(`/lists/${listId}/items/toggle`, { tmdb_id, media_type });
        setList(prev => ({
            ...prev,
            items: prev.items.filter(i => !(i.tmdb_id === tmdb_id && i.media_type === media_type))
        }));
    };
 
    return { list, loading, error, removeItem };
}

export function useListsDropdown(tmdb_id, media_type) {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        if (!tmdb_id || !media_type) return;
        const cargar = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/lists/dropdown/${tmdb_id}/${media_type}`);
                setLists(res.datos);
            } catch {
                // Si falla el dropdown no bloqueamos la página entera
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [tmdb_id, media_type]);
 
    const toggle = async (listId, itemData) => {
        const res = await api.post(`/lists/${listId}/items/toggle`, itemData);
        const action = res.datos.action;
        // Actualización optimista: invertimos el tick localmente
        setLists(prev =>
            prev.map(l => l.id === listId ? { ...l, contains: action === "added" } : l)
        );
        return action;
    };
 
    return { lists, loading, toggle };
}