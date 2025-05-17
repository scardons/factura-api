"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const factura_routes_1 = __importDefault(require("./routes/factura.routes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Servir archivos estáticos (incluye index.html en /public)
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/facturas', factura_routes_1.default);
exports.default = app;
