import Account from "../accounts/account.model.js";

export const crearCuenta = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const { tipoCuenta } = req.body;

    if (!tipoCuenta || !["AHORRO", "MONETARIA"].includes(tipoCuenta)) {
      return res.status(400).json({ message: "Tipo de cuenta inválido" });
    }

    const nuevaCuenta = new Account({
      tipoCuenta,
      owner: req.usuario._id,
      state: false,
    });

    await nuevaCuenta.save();

    return res.status(201).json({
      message: "Cuenta creada exitosamente, pendiente de activación",
      cuenta: nuevaCuenta,
    });
  } catch (error) {
    console.error("Error al crear cuenta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
