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