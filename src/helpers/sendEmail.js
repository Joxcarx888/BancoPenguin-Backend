import nodemailer from "nodemailer";

export const sendWelcomeEmail = async ({ to, username, codigoBanco }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Banco Penguin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Bienvenido a Banco Penguin",
    html: `
      <h2>¡Bienvenido!</h2>
      <p>Gracias por registrarte, <strong>${username}</strong>.</p>
      <p>Tu código de banco es: <strong>${codigoBanco}</strong>.</p>
      <p>¡Estamos emocionados de tenerte con nosotros!</p>
    `,
  });
};

export const sendResetPasswordEmail = async ({ to, username, resetUrl }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Banco Penguin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Restablece tu contraseña - Banco Penguin",
    html: `
      <h2>Hola, ${username}</h2>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
      <a href="${resetUrl}" target="_blank" style="display:inline-block;margin-top:10px;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Restablecer contraseña</a>
      <p>Este enlace es válido durante 30 minutos.</p>
      <p>Si no realizaste esta solicitud, puedes ignorar este mensaje.</p>
    `,
  });
};