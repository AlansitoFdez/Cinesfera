const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const List = models.lists
const ListItem = models.listItems

const MAX_LISTS_PER_USER = 10

class ListService {
    
    async getMyLists(userId) {
        const lists = await List.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: ListItem,
                    as: "list_items",
                    attributes: ["id"]
                }
            ],
            order: [["created_at", "ASC"]]
        })
 
        return lists.map(list => ({
            id: list.id,
            name: list.name,
            description: list.description,
            is_default: list.is_default,
            is_public: list.is_public,
            item_count: list.list_items.length,
            created_at: list.created_at
        }))
    }

    async getListsForDropdown(userId, tmdb_id, media_type) {
        const lists = await List.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: ListItem,
                    as: "list_items",
                    required: false, 
                    where: { tmdb_id, media_type }
                }
            ],
            order: [["created_at", "ASC"]]
        })
 
        return lists.map(list => ({
            id: list.id,
            name: list.name,
            is_default: list.is_default,
            contains: list.list_items.length > 0
        }))
    }

    async getPublicListsByUser(userId) {
        const lists = await List.findAll({
            where: { user_id: userId, is_public: true },
            include: [
                {
                    model: ListItem,
                    as: "list_items",
                    attributes: ["id"]
                }
            ],
            order: [["created_at", "ASC"]]
        })
 
        return lists.map(list => ({
            id: list.id,
            name: list.name,
            description: list.description,
            is_default: list.is_default,
            item_count: list.list_items.length,
            created_at: list.created_at
        }))
    }

    async createList(userId, { name, description, is_public = true }) {
        const count = await List.count({ where: { user_id: userId } })
        if (count >= MAX_LISTS_PER_USER) {
            const error = new Error(`No puedes tener más de ${MAX_LISTS_PER_USER} listas`)
            error.isControlled = true
            error.status = 400
            throw error
        }
 
        if (!name || name.trim().length === 0) {
            const error = new Error("El nombre de la lista es obligatorio")
            error.isControlled = true
            error.status = 400
            throw error
        }
 
        const existing = await List.findOne({
            where: { user_id: userId, name: name.trim() }
        })
        if (existing) {
            const error = new Error("Ya tienes una lista con ese nombre")
            error.isControlled = true
            error.status = 400
            throw error
        }
 
        const list = await List.create({
            user_id: userId,
            name: name.trim(),
            description: description?.trim() || null,
            is_public,
            is_default: false
        })
 
        return list
    }

    async getListDetail(listId, userId) {
        const list = await List.findByPk(listId)
        if (!list) {
            const error = new Error("Lista no encontrada")
            error.isControlled = true
            error.status = 404
            throw error
        }
 
        const isOwner = list.user_id === userId
        if (!list.is_public && !isOwner) {
            const error = new Error("Esta lista es privada")
            error.isControlled = true
            error.status = 403
            throw error
        }
 
        const items = await ListItem.findAll({
            where: { list_id: listId },
            include: [
                {
                    model: ContentCache,
                    as: "tmdb",
                    attributes: ["tmdb_id", "title", "poster_path", "vote_average", "media_type"]
                }
            ],
            order: [["added_at", "DESC"]]
        })
 
        return {
            id: list.id,
            name: list.name,
            description: list.description,
            is_default: list.is_default,
            is_public: list.is_public,
            is_owner: isOwner,
            items: items.map(item => item.tmdb)
        }
    }
}

module.exports = new ListService()