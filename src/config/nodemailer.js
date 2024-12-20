import nodemailer from 'nodemailer';

// Crear una instancia de transporte para nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Cambia según tu proveedor (p.ej., Outlook, Yahoo)
  auth: {
    user: process.env.EMAIL_USER, // Tu correo
    pass: process.env.EMAIL_PASS, // Contraseña o clave de aplicación
  },
});

// Exportar el transporte de forma correcta
export default transporter;
