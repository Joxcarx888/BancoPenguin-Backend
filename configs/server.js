'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import movementRoutes from '../src/movements/movement.routes.js'
import accountRoutes from '../src/accounts/account.routes.js'
import userRoutes from '../src/users/user.routes.js';
import prizeRoutes from '../src/prizes/prize.routes.js';
import redemptionRoutes from '../src/redemption/redemption.routes.js';



const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) =>{
    app.use('/BancoPenguin/v1/auth', authRoutes);
    app.use('/BancoPenguin/v1/movement', movementRoutes);
    app.use('/BancoPenguin/v1/account', accountRoutes);
    app.use('/BancoPenguin/v1/user', userRoutes);
    app.use('/BancoPenguin/v1/prize', prizeRoutes);
    app.use('/BancoPenguin/v1/redemption', redemptionRoutes);
}

const conectarDB = async () => {
    try{
        await dbConnection();
        console.log("Conexion a la base de datos exitosa");
    }catch(error){
        console.error('Error Conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () =>{
    const app = express();
    const port = process.env.PORT || 3333;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port:  ${port}`)

    } catch (err) {
        console.log(`Server init fail : ${err}`)
    }
}