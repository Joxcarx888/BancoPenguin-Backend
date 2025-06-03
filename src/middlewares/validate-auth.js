import Usuario from "../users/user.model.js";
import { hash, verify } from 'argon2';

export const validateLogin = async (req, res) => {
    try {
        
        const { email, password, username } = req.body;
        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;
        
        const user = await Usuario.findOne({
            $or: [{ email: lowerEmail }, { username: lowerUsername }]
        });
        
        if(!user){
            return res.status(400).json({
                msg: 'Credenciales incorrectas, Correo no existe en la base de datos'
            });
        }
 
        if(!user.state){
            return res.status(400).json({
                msg: 'El usuario no existe en la base de datos'
            });
        }
 
        const validPassword = await verify(user.password, password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'La contraseña es incorrecta'
            });
        }
    } catch (e) {
        return res.status(500).json({
            message: "Server error",
            error: e.message
        })
    }
}

export const validateRegisterUser = async (req, res) => {
  try {
    const {
      name,
      username,
      dpi,
      direccion,
      telefono,
      email,
      password,
      nombreTrabajo,
      montoMensual,
    } = req.body;

    if (
      !name || !username || !dpi || !direccion || !telefono ||
      !email || !password || !nombreTrabajo || !montoMensual
    ) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        msg: "La contraseña debe tener al menos 8 caracteres",
      });
    }

    if (name.length > 35) {
      return res.status(400).json({
        msg: "El nombre no puede exceder los 35 caracteres",
      });
    }

    if (montoMensual < 100) {
      return res.status(400).json({
        msg: "Los ingresos mensuales deben ser al menos Q100",
      });
    }

    const existingUser = await Usuario.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "El correo o el username ya están registrados",
      });
    }

  } catch (e) {
    return res.status(500).json({
      message: "Error del servidor al validar los datos",
      error: e.message
    });
  }
};
