// ============================================================================
// IMPORTACIONES
// ============================================================================
const config = require('./config/config.js');
const express = require('express');
const cors = require('cors')
const { logMensaje } = require('./utils/logger.js')
const { verifyToken } = require('./middlewares/auth.js')


// ============================================================================
// VARIABLES DE RUTAS DE LA API
// ============================================================================
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes");
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
app.use(cors());


// ============================================================================
// RUTAS - API REST
// ============================================================================
app.use("/api/auth", authRoutes)
app.use("/api/user", verifyToken, userRoutes)


// ============================================================================
// INICIO DEL SERVIDOR
// ============================================================================
app.listen(port, () => {
    logMensaje(`Servidor corriendo en el puerto ${port}`);
});


// EXPORTACIÓN DE LA APLICACIÓN
module.exports = app;
