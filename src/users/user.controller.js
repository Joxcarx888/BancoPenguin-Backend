import User from './user.model.js';

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
