"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// src/config/db.ts
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // necesario para Render y algunos otros servicios en la nube
    },
});
// Opcional: para probar la conexión al iniciar la app
exports.pool.connect()
    .then((client) => {
    console.log('Conectado a la base de datos PostgreSQL');
    client.release();
})
    .catch((err) => {
    console.error('Error conectando a la base de datos', err.stack);
});
