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
      <div style="font-family: 'Arial', sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">  
          <div style="background-color: #4a90e2; text-align: center; padding: 30px 0;">
            <h1 style="color: white; margin: 0;">Banco Penguin</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333;">¡Bienvenido, ${username}!</h2>
            <p style="font-size: 16px; color: #555;">Gracias por registrarte en <strong>Banco Penguin</strong>.</p>
            <p>Tu código de banco es:</p>
            <p style="font-size: 22px; font-weight: bold; color: #4a90e2;">${codigoBanco}</p>
            <p style="margin-top: 20px;">Tu cuenta será <strong>aceptada próximamente por un administrador</strong>. Recibirás una notificación cuando esté activa.</p>
            <p style="margin-top: 20px;">¡Estamos emocionados de tenerte con nosotros!</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999;">Este es un mensaje automático. Por favor, no respondas a este correo.</p>
          </div>
        </div>
      </div>
    `,
  });
};

export const sendResetPasswordEmail = async (to, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Banco Penguin" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Tu código de verificación - Banco Penguin",
      html: `
        <div style="font-family: 'Arial', sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
            <div style="background-color: #4a90e2; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Banco Penguin</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333;">Restablece tu contraseña</h2>
              <p style="color: #555;">Hola, has solicitado restablecer tu contraseña.</p>
              <p>Usa el siguiente código para continuar con el proceso:</p>
              <p style="font-size: 28px; font-weight: bold; color: #4a90e2; letter-spacing: 2px; text-align: center;">${token}</p>
              <p>Este código es válido por 30 minutos.</p>
              <p style="color: #999;">Si no solicitaste este cambio, puedes ignorar este mensaje con seguridad.</p>
              <hr style="margin: 30px 0;">
              <p style="font-size: 12px; color: #999;">Este es un mensaje automático. Por favor, no respondas a este correo.</p>
            </div>
          </div>
        </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email enviado:", info.response);
  } catch (error) {
    console.error(" Error al enviar el correo:", error.message);
  }
};
