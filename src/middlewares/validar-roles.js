import jwt from 'jsonwebtoken';

import Usuario from '../users/user.model.js';

export const validarJWT = async (req, res, next) => {

    const token = req.header("x-token");

    if(!token){
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(401).json({
                msg: "Usuario no existe en la base de datos"
            })
        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: "Token no valido - Usuario con estado: false"
            })
        }

        req.usuario = usuario;

        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({
            msg: "Token no valido"
        })
    }
}

export const tieneRole = (...roles) => {
    return (req, res, next) => {
        if (!req.usuario || !req.usuario.role) {
            return res.status(500).json({
                success: false,
                msg: 'Trying to verify a role without validating the token first 🔑❌'
            });
        }

        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                success: false,
                msg: `Unauthorized user, has a role ${req.usuario.role}, authorized roles are: [${roles.join(', ')}] 🚫🔒`
            });
        }

        next();
    };
};
