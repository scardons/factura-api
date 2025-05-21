"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extraerDatosFactura = extraerDatosFactura;
// src/utils/extraerDatosFactura.ts
function extraerDatosFactura(texto) {
    var _a, _b, _c;
    const nombreMatch = texto.match(/Nombre del cliente:\s*(.+)/i);
    const emailMatch = texto.match(/Email del cliente:\s*(.+)/i);
    const productoMatch = texto.match(/Producto:\s*(.+)/i);
    const montoMatch = texto.match(/Monto:\s*([\d.,]+)/i); // sin '$' ni 'COP'
    return {
        nombreCliente: ((_a = nombreMatch === null || nombreMatch === void 0 ? void 0 : nombreMatch[1]) === null || _a === void 0 ? void 0 : _a.trim()) || '',
        emailCliente: ((_b = emailMatch === null || emailMatch === void 0 ? void 0 : emailMatch[1]) === null || _b === void 0 ? void 0 : _b.trim()) || '',
        nombreProducto: ((_c = productoMatch === null || productoMatch === void 0 ? void 0 : productoMatch[1]) === null || _c === void 0 ? void 0 : _c.trim()) || '',
        monto: parseFloat(((montoMatch === null || montoMatch === void 0 ? void 0 : montoMatch[1]) || '0').replace(/[^\d.]/g, ''))
    };
}
