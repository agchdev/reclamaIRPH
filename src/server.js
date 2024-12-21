// Importamos las dependencias necesarias
import express from 'express'; // Framework para crear aplicaciones web en Node.js
import bodyParser from 'body-parser'; // Middleware para manejar datos de formularios
import nodemailer from './config/nodemailer.js'; // Configuración para enviar correos electrónicos
import dotenv from 'dotenv'; // Carga variables de entorno desde un archivo .env
import path from 'path'; // Módulo para trabajar con rutas de archivos
import { fileURLToPath } from 'url'; // Módulo para obtener la ruta del archivo actual en ES6
import { generarPDF } from './config/generarPDF.js'; // Función para generar el PDF
import multer from 'multer';
import fs from 'fs';

// Cargar las variables de entorno desde un archivo .env
dotenv.config();

// Configurar directorio de subida de archivos
const upload = multer({ dest: 'uploads/' });


// Obtener la ruta del archivo actual y su directorio, útil para manejar rutas relativas
const __filename = fileURLToPath(import.meta.url); // Ruta del archivo actual
const __dirname = path.dirname(__filename); // Directorio del archivo actual

// Crear carpeta 'uploads/' si no existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Crear una instancia de Express
const app = express();
const PORT = 3000; // Puerto en el que se ejecutará el servidor

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Procesa datos URL-encoded de formularios
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos desde la carpeta 'public'

// Ruta principal que muestra el formulario
app.get('/', (req, res) => {
  // Envía el archivo HTML principal al cliente
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta para manejar el envío del formulario y generar el PDF
app.post('/send-email', upload.single('file'), async (req, res) => {
  // Extrae los datos del cuerpo de la solicitud
  const { name, email, message } = req.body;
  const file = req.file; // Archivo subido

  // Generar el PDF con la información del formulario
  try {
    const pdfPath = await generarPDF({ nombre: name, email, mensaje: message, fecha: new Date().toLocaleDateString() });

    // Configuración del correo a enviar
    const mailOptions = {
      from: email, // Remitente del correo (el email del usuario)
      to: process.env.EMAIL_USER, // Correo del destinatario (configurado en las variables de entorno)
      subject: 'Nuevo mensaje de contacto', // Asunto del correo
      text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`, // Contenido del correo
      attachments: [
        {
          filename: `formulario_${Date.now()}.pdf`,
          path: pdfPath, // Ruta del PDF generado
        },
        {
          filename: file.originalname,
          path: file.path,
        },
      ],
    };

    // Enviar el correo con el archivo adjunto
    await nodemailer.sendMail(mailOptions);
    res.send('Correo enviado correctamente con el PDF adjunto'); // Respuesta al cliente si el correo se envía con éxito
    fs.unlink(file.path, (err) => {
      if (err) console.error('Error al eliminar el archivo:', err);
      else console.log('Archivo eliminado correctamente');
    });
  } catch (error) {
    // Manejo de errores al generar el PDF o enviar el correo
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send('Error al enviar el correo o generar el PDF');
  }
});

// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje de confirmación en consola
});
