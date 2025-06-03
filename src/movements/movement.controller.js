import User from "../users/user.model.js";
import Movement from "../movements/movement.model.js";

export const crearMovimiento = async (req, res) => {
  const { toAccount, amount, description = "" } = req.body;

  try {
    if (!req.usuario) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const monto = Number(amount);
    if (!monto || monto <= 0) {
      return res.status(400).json({ message: "Monto inválido" });
    }

    if (monto > 2000) {
      return res.status(400).json({ message: "No se puede transferir más de Q2000 por transacción" });
    }

    const usuarioEmisor = await User.findById(req.usuario._id);
    const fromAccount = usuarioEmisor.noCuenta;

    // Aquí la validación para evitar transferencia a sí mismo:
    if (fromAccount === toAccount) {
      return res.status(400).json({ message: "No puedes transferirte dinero a ti mismo" });
    }

    const usuarioReceptor = await User.findOne({ noCuenta: toAccount });

    if (!usuarioReceptor) {
      return res.status(404).json({ message: "Cuenta destino no encontrada" });
    }

    if (!usuarioReceptor.state) {
      return res.status(400).json({ message: "No se puede enviar saldo a un usuario inactivo" });
    }

    if (usuarioEmisor.saldo < monto) {
      return res.status(400).json({ message: "Saldo insuficiente" });
    }

    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999);

    const movimientosHoy = await Movement.aggregate([
      {
        $match: {
          fromAccount,
          createdAt: { $gte: inicioDelDia, $lte: finDelDia },
          active: { $ne: false },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalHoy = movimientosHoy.length > 0 ? movimientosHoy[0].total : 0;
    if (totalHoy + monto > 10000) {
      return res.status(400).json({ message: "No se puede transferir más de Q10,000 por día" });
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
      active: true,
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


export const cancelarMovimiento = async (req, res) => {
  const { movimientoId } = req.params;

  try {
    if (!req.usuario) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const movimiento = await Movement.findById(movimientoId);
    if (!movimiento) {
      return res.status(404).json({ message: "Movimiento no encontrado" });
    }

    if (movimiento.createdBy.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: "No tienes permiso para cancelar este movimiento" });
    }

    const ahora = new Date();
    const tiempoCreacion = new Date(movimiento.createdAt);
    const diferenciaMinutos = (ahora - tiempoCreacion) / (1000 * 60);

    if (diferenciaMinutos > 3) {
      return res.status(400).json({ message: "Ya no se puede cancelar el movimiento (más de 3 minutos)" });
    }

    if (!movimiento.active) {
      return res.status(400).json({ message: "El movimiento ya está cancelado" });
    }

    const emisor = await User.findOne({ noCuenta: movimiento.fromAccount });
    const receptor = await User.findOne({ noCuenta: movimiento.toAccount });

    if (!emisor || !receptor) {
      return res.status(404).json({ message: "Usuarios relacionados no encontrados" });
    }

    receptor.saldo -= movimiento.amount;
    emisor.saldo += movimiento.amount;

    await emisor.save();
    await receptor.save();

    movimiento.active = false;
    await movimiento.save();

    return res.status(200).json({ message: "Movimiento cancelado con éxito" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al cancelar el movimiento", error: error.message });
  }
};

