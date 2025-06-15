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

export const getPendingAccounts = async (req, res) => {
  try {
    const cuentas = await Account.find({ state: false }).populate('owner', 'name username email');
    return res.status(200).json({ success: true, cuentas });
  } catch (error) {
    console.error("Error al obtener cuentas pendientes:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getActiveAccounts = async (req, res) => {
  try {
    const cuentas = await Account.find({ state: true }).populate('owner', 'name username email');
    return res.status(200).json({ success: true, cuentas });
  } catch (error) {
    console.error("Error al obtener cuentas activas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const acceptAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const cuenta = await Account.findById(id);
    if (!cuenta) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    cuenta.state = true;
    await cuenta.save();

    return res.status(200).json({
      message: "Cuenta activada correctamente",
      cuenta
    });
  } catch (error) {
    console.error("Error al activar cuenta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getMyAccounts = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const cuentas = await Account.find({ owner: userId, state: true }).populate('owner', 'name username email');

    return res.status(200).json({
      success: true,
      cuentas,
    });
  } catch (error) {
    console.error("Error al obtener cuentas del usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const cuenta = await Account.findById(id);

    if (!cuenta) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    if (cuenta.state === false) {
      return res.status(400).json({ message: "La cuenta ya está desactivada" });
    }

    cuenta.state = false;
    await cuenta.save();

    return res.status(200).json({
      success: true,
      message: "Cuenta desactivada correctamente",
      cuenta,
    });
  } catch (error) {
    console.error("Error al desactivar cuenta:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


