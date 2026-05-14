// ============================================================================
// IMPORTACIONES
// ============================================================================
const config = require('./config/config.js');
const express = require('express');
const cors = require('cors')
const { logMensaje } = require('./utils/logger.js')
const { verifyToken } = require('./middlewares/auth.js')
const { verifyAdmin } = require('./middlewares/auth.js')


// ============================================================================
// VARIABLES DE RUTAS DE LA API
// ============================================================================
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const followRoutes = require("./routes/followRoutes");
const listRoutes = require("./routes/listRoutes")
const adminRoutes = require("./routes/adminRoutes")
const recommendationRoutes = require("./routes/recommendationRoutes")
const cookieParser = require('cookie-parser');


// ============================================================================
// INICIO DEL SERVIDOR
// ============================================================================
const app = express();
const port = config.port;


// ============================================================================
// MIDDLEWARE - PARSEO
// ============================================================================
app.use(express.json());
app.use(cookieParser())


// ============================================================================
// MIDDLEWARE - CORS
// ============================================================================
app.use(cors({
    origin: config.frontendUrl,
    credentials: true
}))


// ============================================================================
// RUTAS - API REST
// ============================================================================
app.use("/api/auth", authRoutes)
app.use("/api/user", verifyToken, userRoutes)
app.use("/api/home", verifyToken, homeRoutes)
app.use("/api/reviews", verifyToken, reviewRoutes)
app.use("/api/follow", verifyToken, followRoutes)
app.use("/api/lists", verifyToken, listRoutes)
app.use("/api/admin", verifyToken, verifyAdmin, adminRoutes)
app.use("/api/recommendations", verifyToken, recommendationRoutes)


// ============================================================================
// INICIO DEL SERVIDOR
// ============================================================================
app.listen(port, () => {
    logMensaje(`Servidor corriendo en el puerto ${port}`);
});


// EXPORTACIÓN DE LA APLICACIÓN
module.exports = app;
