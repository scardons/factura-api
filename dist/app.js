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
// Ruta raíz para que Render no diga "Cannot GET /"
app.get('/', (req, res) => {
    res.send('¡La API de procesamiento de facturas está funcionando!');
});
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/facturas', factura_routes_1.default);
exports.default = app;
