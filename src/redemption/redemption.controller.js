import Redemption from './redemption.model.js';
import Account from '../accounts/account.model.js';
import Prize from '../prizes/prize.model.js';
import { response } from 'express';

export const createRedemption = async (req, res = response) => {
    try {
      const { prizeId, numeroCuenta } = req.body;
      const loggedUser = req.usuario;  

      const account = await Account.findOne({ 
        numeroCuenta, 
        owner: loggedUser._id,
        state: true 
      });
  
      if (!account) {
        return res.status(404).json({
          success: false,
          msg: "Cuenta no encontrada o no pertenece al usuario autenticado.",
        });
      }
 
      const prize = await Prize.findById(prizeId);
      if (!prize || !prize.activo) {
        return res.status(404).json({
          success: false,
          msg: "Recompensa no encontrada o no disponible",
        });
      }

      if (account.puntos < prize.precioPuntos) {
        return res.status(400).json({
          success: false,
          msg: "No tienes suficientes puntos en esta cuenta para canjear la recompensa.",
        });
      }

      const newRedemption = new Redemption({
        user: loggedUser._id,
        prize: prizeId,
        pointsUsed: prize.precioPuntos,
        status: "completed",
      });
  
      await newRedemption.save();
  
      account.puntos -= prize.precioPuntos;
      await account.save();
  
      res.status(201).json({
        success: true,
        msg: "Recompensa canjeada exitosamente",
        redemption: newRedemption,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: "Error al procesar el canje de recompensa",
        error: error.message,
      });
    }
  };

  export const getRedemptions = async (req, res = response) => {
    try {
      const loggedUser = req.usuario; 
      let redemptions;
  
      if (loggedUser.role === 'ADMIN') {
        redemptions = await Redemption.find()
          .populate('user', 'name email')
          .populate('prize', 'nombre precioPuntos descripcion');
      } else {
        redemptions = await Redemption.find({ user: loggedUser._id })
          .populate('user', 'name email')
          .populate('prize', 'nombre precioPuntos descripcion');
      }
  
      return res.status(200).json({
        success: true,
        redemptions,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: 'Error al obtener recompensas',
        error: error.message,
      });
    }
  };