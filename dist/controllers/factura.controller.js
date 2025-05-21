"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesarFacturaPDF = void 0;
const factura_service_1 = require("../services/factura.service");
const procesarFacturaPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ success: false, error: 'No se subió ningún archivo' });
        return;
    }
    try {
        const resultado = yield (0, factura_service_1.procesarFacturaService)(req.file.path);
        res.json(Object.assign({ success: true, mensaje: 'Factura procesada exitosamente' }, resultado));
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al procesar la factura' });
    }
});
exports.procesarFacturaPDF = procesarFacturaPDF;
