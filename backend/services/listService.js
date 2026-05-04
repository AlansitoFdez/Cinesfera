const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const List = models.lists
const ListItem = models.listItems


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
}

module.exports = new ListService()