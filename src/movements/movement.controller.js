import User from "../users/user.model.js";
import Movement from "../movements/movement.model.js";

export const crearMovimiento = async (req, res) => {
  const { fromAccount, toAccount, amount, description = "" } = req.body;

  try {
    const monto = Number(amount);
    if (!monto || monto <= 0) {
      return res.status(400).json({ message: "Monto inválido" });
    }

    const usuarioEmisor = await User.findOne({ noCuenta: fromAccount });
    const usuarioReceptor = await User.findOne({ noCuenta: toAccount });

    if (!usuarioEmisor || !usuarioReceptor) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }

    if (usuarioEmisor.saldo < monto) {
      return res.status(400).json({ message: "Saldo insuficiente" });
    }

    usuarioEmisor.saldo -= monto;
    usuarioReceptor.saldo += monto;

    await usuarioEmisor.save();
    await usuarioReceptor.save();

    const movimiento = await Movement.create({
      amount: monto,
      fromAccount,
      toAccount,
      description,
      saldoPosterior: usuarioEmisor.saldo,
      createdBy: usuarioEmisor._id,
    });

    return res.status(201).json({
      message: "Movimiento realizado exitosamente",
      movimiento,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error en el servidor al procesar el movimiento",
      error: error.message,
    });
  }
};
