const initModels = require("../models/init-models").initModels
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sequelize = require("../config/sequelize")
const models = initModels(sequelize)

const User = models.users

class AuthService {
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw { status: 404, message: "Usuario no encontrado o inexistente" };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw { status: 401, message: "Contraseña incorrecta" };
    }

    const token = jwt.sign({
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },  
      process.env.SECRET_KEY,
      {
        expiresIn: "1h"
      }
    )

    delete user.dataValues.password;
    return { user, token };
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

    const token = jwt.sign({
      sub: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h"
      }
    )
    return { newUser, token };
  }

  // ── NUEVO ──────────────────────────────────────────────────────────────────
  async me(token) {
    if (!token) {
      throw { status: 401, message: "No hay sesión activa" };
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return decoded;
    } catch (err) {
      throw { status: 401, message: "Sesión expirada o inválida" };
    }
  }
  // ── FIN NUEVO ──────────────────────────────────────────────────────────────
}

module.exports = new AuthService()