import Usuario from '../users/user.model.js';
import Account from '../accounts/account.model.js';
import { hash, verify } from 'argon2';
import { generarJWT } from '../helpers/generate-jwt.js';
import { validateLogin, validateRegisterUser } from '../middlewares/validate-auth.js';

export const login = async (req, res) => {
  const { email, username, password, codigoBanco } = req.body;

  try {
    await validateLogin(req, res);
    if (res.headersSent) return;

    const lowerEmail = email ? email.toLowerCase() : null;
    const lowerUsername = username ? username.toLowerCase() : null;

    const user = await Usuario.findOne({
      $or: [{ email: lowerEmail }, { username: lowerUsername }]
    });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    if (!user.state) {
      return res.status(403).json({ message: "Cuenta pendiente de activación" });
    }

    const isValid = await verify(user.password, password);
    if (!isValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    if (user.role === "CLIENT") {
      if (!codigoBanco || user.codigoBanco !== codigoBanco) {
        return res.status(403).json({
          message: "Código de banco incorrecto o no proporcionado"
        });
      }
    }

    const token = await generarJWT(user.id, user.role);

    return res.status(200).json({
      msg: "Inicio de sesión exitoso",
      userDetails: {
        username: user.username,
        role: user.role,
        token,
      }
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Error del servidor",
      error: e.message
    });
  }
};

export const register = async (req, res) => {
  try {
    await validateRegisterUser(req, res);
    if (res.headersSent) return;

    const data = req.body;
    const encryptedPassword = await hash(data.password);

    const user = await Usuario.create({
      name: data.name,
      username: data.username,
      dpi: data.dpi,
      direccion: data.direccion,
      telefono: data.telefono,
      email: data.email.toLowerCase(),
      password: encryptedPassword,
      nombreTrabajo: data.nombreTrabajo,
      montoMensual: data.montoMensual,
      role: "CLIENT",
      state: false,
    });

    await Account.create({
      tipoCuenta: data.tipoCuenta || "AHORRO",
      owner: user._id,
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente (pendiente de activación)",
      userDetails: {
        email: user.email,
        role: user.role,
        state: user.state,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Fallo al registrar usuario",
      error: error.message
    });
  }
};
