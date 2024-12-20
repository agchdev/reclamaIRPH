import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from './config/nodemailer.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar las variables de entorno
dotenv.config();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal (Formulario)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta para enviar el correo
app.post('/send-email', async (req, res) => {
    console.log(req)
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'Nuevo mensaje de contacto',
    text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`,
  };

  console.log("Mail Options ->"+mailOptions);

  try {
    await nodemailer.sendMail(mailOptions);
    res.send('Correo enviado correctamente');
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    console.log(name, email, message, process.env.EMAIL_USER)
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
