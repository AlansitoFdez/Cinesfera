const initModels = require("../models/init-models").initModels
const bcrypt = require("bcrypt")
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const User = models.users

class UserService {
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado o inexistente" };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw { status: 401, message: "Contraseña incorrecta" };
    }

    delete user.dataValues.password;
    return user;
  }

  async signup(username, email, password, biography) {
    if (!username || !email || !password) {
      throw { status: 400, message: "Datos incompletos" };
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw { status: 400, message: "Usuario ya existente" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword, biography });
    delete newUser.dataValues.password;
    return newUser;
  }
}

module.exports = new UserService()
