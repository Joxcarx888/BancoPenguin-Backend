import User from "../users/user.model.js";
import Account from "../accounts/account.model.js";
import Movement from "../movements/movement.model.js";

export const crearMovimiento = async (req, res) => {
  const { fromAccount, toAccount, amount, description = "" } = req.body;

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

    const cuentaEmisor = await Account.findOne({ numeroCuenta: fromAccount, owner: req.usuario._id });
    if (!cuentaEmisor) {
      return res.status(404).json({ message: "Cuenta de origen no encontrada o no pertenece al usuario" });
    }

    const cuentaReceptor = await Account.findOne({ numeroCuenta: toAccount });
    if (!cuentaReceptor) {
      return res.status(404).json({ message: "Cuenta de destino no encontrada" });
    }

    if (!cuentaEmisor.state) {
      return res.status(400).json({ message: "La cuenta emisora está inactiva" });
    }

    if (!cuentaReceptor.state) {
      return res.status(400).json({ message: "La cuenta receptora está inactiva" });
    }

    if (fromAccount === toAccount) {
      return res.status(400).json({ message: "No puedes transferirte dinero a ti mismo" });
    }

    const receptor = await User.findById(cuentaReceptor.owner);
    if (!receptor || !receptor.state) {
      return res.status(400).json({ message: "No se puede enviar saldo a un usuario inactivo" });
    }

    if (cuentaEmisor.saldo < monto) {
      return res.status(400).json({ message: "Saldo insuficiente" });
    }

    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999);

    const movimientosHoy = await Movement.aggregate([
      {
        $match: {
          fromAccount: cuentaEmisor.numeroCuenta,
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

    cuentaEmisor.saldo -= monto;
    cuentaReceptor.saldo += monto;

    await cuentaEmisor.save();
    await cuentaReceptor.save();

    const movimiento = await Movement.create({
      amount: monto,
      fromAccount: cuentaEmisor.numeroCuenta,
      toAccount: cuentaReceptor.numeroCuenta,
      description,
      saldoPosterior: cuentaEmisor.saldo,
      createdBy: req.usuario._id,
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

    const cuentaEmisor = await Account.findOne({ numeroCuenta: movimiento.fromAccount });
    const cuentaReceptor = await Account.findOne({ numeroCuenta: movimiento.toAccount });

    if (!cuentaEmisor || !cuentaReceptor) {
      return res.status(404).json({ message: "Cuentas relacionadas no encontradas" });
    }

    cuentaReceptor.saldo -= movimiento.amount;
    cuentaEmisor.saldo += movimiento.amount;

    await cuentaEmisor.save();
    await cuentaReceptor.save();

    movimiento.active = false;
    await movimiento.save();

    return res.status(200).json({ message: "Movimiento cancelado con éxito" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al cancelar el movimiento", error: error.message });
  }
};

export const getActiveMovements = async (req, res) => {
  try {
    const movimientos = await Movement.find({ active: true }).sort({ createdAt: -1 });
    return res.status(200).json(movimientos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al obtener movimientos activos", error: error.message });
  }
};

export const getCanceledMovements = async (req, res) => {
  try {
    const movimientos = await Movement.find({ active: false }).sort({ createdAt: -1 });
    return res.status(200).json(movimientos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al obtener movimientos cancelados", error: error.message });
  }
};

export const getMyMovements = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const movimientos = await Movement.find({ createdBy: req.usuario._id }).sort({ createdAt: -1 });

    return res.status(200).json(movimientos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al obtener tus movimientos", error: error.message });
  }
};
