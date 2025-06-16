import Favorite from "./favorite.model.js";
import Account from "../accounts/account.model.js";


export const agregarAFavoritos = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const { numeroCuenta, alias } = req.body;


    const cuenta = await Account.findOne({ numeroCuenta });
    if (!cuenta) {
      return res.status(404).json({ message: "Cuenta no encontrada" });
    }


    const yaExiste = await Favorite.findOne({ owner: userId, cuenta: cuenta._id });
    if (yaExiste) {
      return res.status(400).json({ message: "La cuenta ya está en favoritos" });
    }

    const favorito = new Favorite({
      owner: userId,
      cuenta: cuenta._id,
      alias,
    });

    await favorito.save();

    res.status(201).json({ message: "Agregado a favoritos", favorito });
  } catch (error) {
    console.error("Error al agregar favorito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const eliminarDeFavoritos = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const { favoritoId } = req.params;

    const favorito = await Favorite.findOne({ _id: favoritoId, owner: userId });

    if (!favorito) {
      return res.status(404).json({ message: "Favorito no encontrado o no autorizado" });
    }

    await favorito.deleteOne();

    res.json({ message: "Eliminado de favoritos" });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const listarFavoritos = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const favoritos = await Favorite.find({ owner: userId })
      .populate({
        path: "cuenta",
        select: "numeroCuenta tipoCuenta", 
      })
      .sort({ createdAt: -1 }); 

    res.json({ favoritos });
  } catch (error) {
    console.error("Error al listar favoritos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

