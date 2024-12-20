import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();  // Cargar las variables de entorno desde el archivo .env


console.log(process.env.EMAIL_PASS, process.env.EMAIL_USER)

const transporter = nodemailer.createTransport({
  service: 'gmail', // Usamos Gmail como servicio SMTP
  auth: {
    user: process.env.EMAIL_USER, // Correo electrónico de la cuenta de Gmail
    pass: process.env.EMAIL_PASS, // Clave de aplicación de Gmail
  },
});

export default transporter;

