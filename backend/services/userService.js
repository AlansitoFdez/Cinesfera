const initModels = require("../models/init-models").initModels
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const User = models.users

class UserService {
    
}

module.exports = UserService
