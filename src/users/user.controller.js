import User from './user.model.js';
import crypto from 'crypto';
import { sendResetPasswordEmail } from "../helpers/sendEmail.js";
import nodemailer from 'nodemailer';
import { hash } from 'argon2';

export const sendResetEmail = async (to, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `http://localhost:3333/penguinManagement/v1/users/reset-password/${token}`;

    const mailOptions = {
      from: `"Banco Penguin" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Restablecimiento de contraseña - Banco Penguin',
      html: `
        <h2>Restablecimiento de contraseña</h2>
        <p>Hola, has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <p><a href="${resetUrl}" target="_blank" style="background:#4a90e2;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Restablecer contraseña</a></p>
        <p>Este enlace será válido por 30 minutos.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📨 Email enviado:', info.response);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
  }
};



export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }); 

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado con ese correo' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expire = Date.now() + 1000 * 60 * 30;

    user.resetToken = token;
    user.resetTokenExpires = new Date(expire);
    await user.save();

    await sendResetEmail(email, token); 

    return res.status(200).json({ msg: 'Token de recuperación enviado al correo' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Error al procesar solicitud' });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Token no válido o expirado" });
    }

    user.password = await hash(password);
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    return res.status(200).json({ msg: "Contraseña actualizada con éxito" });
  } catch (err) {
    console.error("Error en resetPassword:", err);
    return res.status(500).json({ msg: "Error al cambiar la contraseña" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'CLIENT', state: true }).select("name email username role");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role || role.toUpperCase() !== 'CLIENT') {
      return res.status(403).json({
        success: false,
        msg: "Solo se pueden consultar usuarios con rol CLIENT.",
      });
    }

    const users = await User.find({
      role: 'CLIENT',
      state: true,
    }).select("name email username");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const user = await User.findById(userId).select("username email name role direccion telefono nombreTrabajo montoMensual");

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error al obtener perfil",
      error: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const loggedUser = req.usuario;
    if (!loggedUser) {
      return res.status(403).json({
        success: false,
        msg: 'No tienes permiso para editar otro perfil.',
      });
    }

    if (loggedUser.role !== 'CLIENT') {
      return res.status(403).json({
        success: false,
        msg: 'Solo los clientes pueden editar su perfil.',
      });
    }

    const allowedFields = ['name', 'direccion', 'nombreTrabajo', 'montoMensual'];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (field in req.body) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(loggedUser._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        msg: 'Usuario no encontrado.',
      });
    }

    res.json({
      success: true,
      msg: 'Perfil actualizado correctamente.',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al actualizar el perfil.',
      error: error.message,
    });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedUser = req.usuario;

    const targetUser = await User.findById(id);

    if (!targetUser || targetUser.role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        msg: 'No tienes permiso para editar este usuario.',
      });
    }

    const { dpi, password, ...updateData } = req.body;

    if (password) {
      return res.status(400).json({
        success: false,
        msg: 'No puedes cambiar la contraseña del usuario.',
      });
    }

    if (dpi) {
      return res.status(400).json({
        success: false,
        msg: 'No puedes cambiar el DPI del usuario.',
      });
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        msg: 'Usuario no encontrado.',
      });
    }

    res.json({
      success: true,
      msg: 'Usuario actualizado correctamente.',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al actualizar el usuario.',
      error: error.message,
    });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const targetUser = await User.findById(id);

    if (!targetUser || targetUser.role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        msg: 'No tienes permiso para eliminar este usuario.',
      });
    }

    await User.findByIdAndUpdate(id, { state: false });

    res.json({
      success: true,
      msg: 'Usuario eliminado correctamente.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Error al eliminar el usuario.',
      error: error.message,
    });
  }
};
