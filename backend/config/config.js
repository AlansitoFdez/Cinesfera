const { logMensaje } = require("../utils/logger")

require("dotenv").config({
    path: `.env`,
})

const config = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        port: process.env.DB_PORT,
    }
}

module.exports = config

logMensaje("CONFIG PORT:" + config.db.user);

logMensaje("CONFIG DBHOST:" + config.db.host);
logMensaje("CONFIG DBPORT:" + config.db.port);
logMensaje("CONFIG DBNAME:" + config.db.name);
logMensaje("CONFIG DBUSER:" + config.db.user);

logMensaje("NODE_ENV DBHOST:" + process.env.DB_HOST);
logMensaje("NODE_ENV DBPORT:" + process.env.DB_PORT);
logMensaje("NODE_ENV DBNAME:" + process.env.DB_NAME);
logMensaje("NODE_ENV DBUSER:" + process.env.DB_USER);

