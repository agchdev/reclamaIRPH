import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // Importar usando ESM
import nodemailer from './config/nodemailer.js'; // Importar nodemailer configurado
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para la raíz (mostrar formulario)
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html')); // Servir el archivo HTML
});

// Ruta para manejar el formulario
app.post('/send-email', async (req, res) => {
  const { name, email, message, 'g-recaptcha-response': recaptchaToken } = req.body;

  // Verificar reCAPTCHA
  const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;

  try {
    const recaptchaResponse = await fetch(recaptchaUrl, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return res.status(400).send('Error de verificación de reCAPTCHA.');
    }

    // Configurar el correo
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_RECEIVER,
      subject: `Nuevo mensaje de ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\nMensaje:\n${message}`,
    };

    // Enviar correo
    nodemailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error al enviar el correo.');
      } else {
        console.log('Correo enviado: ' + info.response);
        res.status(200).send('Correo enviado correctamente.');
      }
    });
  } catch (error) {
    console.error('Error al verificar reCAPTCHA:', error);
    res.status(500).send('Error interno del servidor.');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
