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
    from: `"Banco Virtual" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Bienvenido a Banco Virtual",
    html: `
      <h2>¡Bienvenido!</h2>
      <p>Gracias por registrarte, <strong>${username}</strong>.</p>
      <p>Tu código de banco es: <strong>${codigoBanco}</strong>.</p>
      <p>¡Estamos emocionados de tenerte con nosotros!</p>
    `,
  });
};
