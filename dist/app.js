"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const factura_routes_1 = __importDefault(require("./routes/factura.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes")); // ✅ importa tus rutas de autenticación
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Servir frontend estático
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Rutas
app.use('/api/facturas', factura_routes_1.default);
app.use('/auth', auth_routes_1.default); // ✅ registrar rutas de autenticación
exports.default = app;
