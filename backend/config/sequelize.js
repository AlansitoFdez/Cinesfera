const { logMensaje } = require("../utils/logger.js");
const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
    : new Sequelize(
        config.db.name,
        config.db.user,
        config.db.password,
        {
            host: config.db.host,
            port: config.db.port,
            dialect: "postgres",
            logging: (msg) => {
                if (msg.includes("ERROR")) {
                    console.error("Error de Sequelize:", msg)
                }
            },
        }
    );

(async () => {
    try {
        await sequelize.authenticate();
        if (process.env.NODE_ENV !== "test") {
            logMensaje("Conexión exitosa a la base de datos PostgreSQL");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
})();

module.exports = sequelize;