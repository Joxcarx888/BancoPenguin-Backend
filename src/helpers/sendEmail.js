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

export const sendResetPasswordEmail = async (to, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Banco Penguin" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Tu código de verificación - Banco Penguin',
      html: `
        <h2>Verificación para restablecer tu contraseña</h2>
        <p>Hola, has solicitado restablecer tu contraseña.</p>
        <p>Utiliza el siguiente código para continuar con el proceso:</p>
        <p style="font-size: 24px; font-weight: bold; color: #4a90e2;">${token}</p>
        <p>Este código es válido por 30 minutos.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(' Email enviado:', info.response);
  } catch (error) {
    console.error(' Error al enviar el correo:', error.message);
  }
};
