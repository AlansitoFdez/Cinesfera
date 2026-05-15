const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Sube un Buffer (los bytes del archivo en memoria que pone Multer)
// a Cloudinary y devuelve la URL pública de la imagen
const uploadToCloudinary = (buffer, userId) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "cinesfera/avatars",
                // Un public_id fijo por usuario garantiza que cada vez que sube
                // una foto nueva sobreescribe la anterior sin acumular archivos
                public_id: `avatar_${userId}`,
                overwrite: true,
                transformation: [
                    { width: 400, height: 400, crop: "fill", gravity: "face" },
                ],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );

        // Convertimos el Buffer en un stream legible y lo conectamos
        // al stream de Cloudinary para que los datos fluyan hacia allí
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null); // null = señal de fin de datos
        readable.pipe(stream);
    });
};

module.exports = { cloudinary, uploadToCloudinary };