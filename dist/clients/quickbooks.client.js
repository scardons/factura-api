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
exports.buscarOCrearCliente = buscarOCrearCliente;
exports.buscarOCrearProducto = buscarOCrearProducto;
exports.crearFacturaQuickBooks = crearFacturaQuickBooks;
// src/clients/quickbooks.client.ts
const axios_1 = __importDefault(require("axios"));
const auth_service_1 = require("../services/auth.service");
function authHeaders(token) {
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
    };
}
function buscarOCrearCliente(nombre, email) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const tokens = yield (0, auth_service_1.cargarTokens)();
        const token = yield (0, auth_service_1.getAccessTokenSeguro)();
        const realmId = tokens === null || tokens === void 0 ? void 0 : tokens.realmId;
        if (!token || !realmId) {
            throw new Error('QuickBooks no autenticado correctamente (token o realmId faltante)');
        }
        const query = `select * from Customer where DisplayName='${nombre}'`;
        const res = yield axios_1.default.get(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`, { headers: authHeaders(token) });
        if (((_b = (_a = res.data.QueryResponse) === null || _a === void 0 ? void 0 : _a.Customer) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            return res.data.QueryResponse.Customer[0];
        }
        const createRes = yield axios_1.default.post(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/customer`, {
            DisplayName: nombre,
            PrimaryEmailAddr: { Address: email },
        }, { headers: authHeaders(token) });
        return createRes.data.Customer;
    });
}
function buscarOCrearProducto(nombre) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const tokens = yield (0, auth_service_1.cargarTokens)();
        const token = yield (0, auth_service_1.getAccessTokenSeguro)();
        const realmId = tokens === null || tokens === void 0 ? void 0 : tokens.realmId;
        if (!token || !realmId) {
            throw new Error('QuickBooks no autenticado correctamente (token o realmId faltante)');
        }
        const query = `select * from Item where Name='${nombre}'`;
        const res = yield axios_1.default.get(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`, { headers: authHeaders(token) });
        if (((_b = (_a = res.data.QueryResponse) === null || _a === void 0 ? void 0 : _a.Item) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            return res.data.QueryResponse.Item[0];
        }
        const createRes = yield axios_1.default.post(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/item`, {
            Name: nombre,
            Type: 'Service',
            IncomeAccountRef: {
                value: '79',
                name: 'Sales of Product Income',
            },
        }, { headers: authHeaders(token) });
        return createRes.data.Item;
    });
}
function crearFacturaQuickBooks(factura) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokens = yield (0, auth_service_1.cargarTokens)();
        const accessToken = yield (0, auth_service_1.getAccessTokenSeguro)();
        const realmId = tokens === null || tokens === void 0 ? void 0 : tokens.realmId;
        if (!accessToken || !realmId) {
            throw new Error('QuickBooks no autenticado correctamente (token o realmId faltante)');
        }
        const res = yield axios_1.default.post(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/invoice`, factura, {
            headers: Object.assign(Object.assign({}, authHeaders(accessToken)), { 'Content-Type': 'application/json' }),
        });
        return res.data;
    });
}
