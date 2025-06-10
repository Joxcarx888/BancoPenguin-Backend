import Prize from "./prize.model.js";


export const crearPrize = async (req, res) => {
  try {
    const { nombre, precioPuntos, descripcion } = req.body;

    if (!nombre || precioPuntos == null || !descripcion) {
      return res.status(400).json({ message: "Nombre, precioPuntos y descripción son obligatorios" });
    }

    const nuevoPrize = new Prize({
      nombre,
      precioPuntos,
      descripcion,
      activo: true,  
    });

    await nuevoPrize.save();

    return res.status(201).json({
      message: "Premio creado exitosamente",
      prize: nuevoPrize,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al crear el premio",
      error: error.message,
    });
  }
};

export const editarPrize = async (req, res) => {
  try {
    const { prizeId } = req.params;
    const { nombre, precioPuntos, descripcion, activo } = req.body;

    const prize = await Prize.findById(prizeId);
    if (!prize) {
      return res.status(404).json({ message: "Premio no encontrado" });
    }

    if (nombre !== undefined) prize.nombre = nombre;
    if (precioPuntos !== undefined) prize.precioPuntos = precioPuntos;
    if (descripcion !== undefined) prize.descripcion = descripcion;
    if (activo !== undefined) prize.activo = activo;

    await prize.save();

    return res.status(200).json({
      message: "Premio actualizado correctamente",
      prize,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al actualizar el premio",
      error: error.message,
    });
  }
};

export const listarPrizes = async (req, res) => {
  try {
    const prizes = await Prize.find({ activo: true });

    return res.status(200).json({
      message: "Lista de premios obtenida exitosamente",
      prizes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al obtener la lista de premios",
      error: error.message,
    });
  }
};
