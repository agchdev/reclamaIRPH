// Importamos las dependencias necesarias
import express from 'express'; // Framework para crear aplicaciones web en Node.js
import bodyParser from 'body-parser'; // Middleware para manejar datos de formularios
import nodemailer from './config/nodemailer.js'; // Configuración para enviar correos electrónicos
import dotenv from 'dotenv'; // Carga variables de entorno desde un archivo .env
import path from 'path'; // Módulo para trabajar con rutas de archivos
import { fileURLToPath } from 'url'; // Módulo para obtener la ruta del archivo actual en ES6

// Cargar las variables de entorno desde un archivo .env
dotenv.config();

// Obtener la ruta del archivo actual y su directorio, útil para manejar rutas relativas
const __filename = fileURLToPath(import.meta.url); // Ruta del archivo actual
const __dirname = path.dirname(__filename); // Directorio del archivo actual

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

// Ruta para manejar el envío del formulario y enviar correos electrónicos
app.post('/send-email', async (req, res) => {
  // Extrae los datos del cuerpo de la solicitud
  console.log(req); // Log para verificar los datos de la solicitud
  const { name, email, message } = req.body;

  // Configuración del correo a enviar
  const mailOptions = {
    from: email, // Remitente del correo (el email del usuario)
    to: process.env.EMAIL_USER, // Correo del destinatario (configurado en las variables de entorno)
    subject: 'Nuevo mensaje de contacto', // Asunto del correo
    text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`, // Contenido del correo
  };

  console.log("Mail Options ->" + mailOptions); // Log para verificar las opciones del correo

  try {
    // Intenta enviar el correo usando nodemailer
    await nodemailer.sendMail(mailOptions);
    res.send('Correo enviado correctamente'); // Respuesta al cliente si el correo se envía con éxito
  } catch (error) {
    // Manejo de errores al enviar el correo
    console.error("Error al enviar el correo:", error); // Log del error
    console.log(name, email, message, process.env.EMAIL_USER); // Información adicional para depuración
  }
});

// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje de confirmación en consola
});
