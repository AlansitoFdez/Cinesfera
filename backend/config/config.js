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
    },
    secretKey: process.env.SECRET_KEY,
    frontendUrl: process.env.FRONTEND_URL,
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
}

module.exports = config

