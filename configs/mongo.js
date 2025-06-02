'use strict';

import mongoose from "mongoose";
import Usuario from "../src/users/user.model.js";
import { hash } from "argon2";

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('Could not connect to MongoDB');
            mongoose.disconnect();
        });

        mongoose.connection.on('connecting', () => {
            console.log('Trying to connect...');
        });

        mongoose.connection.on('connected', async () => {
            console.log('Connected to MongoDB');

            try {
                const adminExists = await Usuario.findOne({ role: "ADMIN" });
                if (!adminExists) {
                    const adminPassword = await hash("B4Nco._PenG1N/Gua7MAl4");
                    await Usuario.create({
                        name: "Banco Penguin",
                        username: "admin",
                        email: "admin@gmail.com",
                        password: adminPassword,
                        role: "ADMIN",
                        telefono: "59129451",
                        direccion: "Guatemala",
                        dpi: "0000000000101", 
                        nombreTrabajo: "Banco Penguin",
                        montoMensual: 1000
                    });
                    console.log("Usuario administrador creado");
                } else {
                    console.log("Usuario administrador ya existe");
                }
            } catch (error) {
                console.error("Error al verificar/crear admin:", error);
            }
        });

        mongoose.connection.on('open', () => {
            console.log('Database connection open');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('Reconnected to MongoDB');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Disconnected from MongoDB');
        });

        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 50,
        });

    } catch (error) {
        console.log('Database connection failed:', error);
    }
};
