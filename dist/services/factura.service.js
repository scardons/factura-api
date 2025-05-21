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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesarFacturaService = void 0;
//src/services/factura.service.ts
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const tokenStore_1 = require("../store/tokenStore");
const extraerDatosFactura_1 = require("../utils/extraerDatosFactura");
const quickbooks_client_1 = require("../clients/quickbooks.client");
const procesarFacturaService = (rutaArchivo) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('--- procesarFacturaService llamado ---');
    console.log('quickbooksTokens actual:', tokenStore_1.quickbooksTokens);
    if (!tokenStore_1.quickbooksTokens) {
        console.error('Error: QuickBooks no autenticado - quickbooksTokens está null o undefined');
        throw new Error('QuickBooks no autenticado');
    }
    const dataBuffer = fs_1.default.readFileSync(rutaArchivo);
    const pdfData = yield (0, pdf_parse_1.default)(dataBuffer);
    const texto = pdfData.text;
    console.log('Texto extraído del PDF:', texto);
    const datos = (0, extraerDatosFactura_1.extraerDatosFactura)(texto);
    console.log('Datos extraídos de la factura:', datos);
    // Llamadas sin realmId ni token (ya se obtienen internamente)
    const cliente = yield (0, quickbooks_client_1.buscarOCrearCliente)(datos.nombreCliente, datos.emailCliente);
    console.log('Cliente obtenido o creado:', cliente);
    const producto = yield (0, quickbooks_client_1.buscarOCrearProducto)(datos.nombreProducto);
    console.log('Producto obtenido o creado:', producto);
    const factura = {
        CustomerRef: { value: cliente.Id },
        Line: [
            {
                Amount: datos.monto,
                DetailType: 'SalesItemLineDetail',
                SalesItemLineDetail: {
                    ItemRef: { value: producto.Id, name: producto.Name }
                }
            }
        ],
        BillEmail: { Address: datos.emailCliente }
    };
    const respuestaFactura = yield (0, quickbooks_client_1.crearFacturaQuickBooks)(factura);
    console.log('Respuesta de creación de factura en QuickBooks:', respuestaFactura);
    return {
        textoExtraido: texto,
        datosExtraidos: datos,
        quickbooksResponse: respuestaFactura
    };
});
exports.procesarFacturaService = procesarFacturaService;
