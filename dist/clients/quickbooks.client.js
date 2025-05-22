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
const axios_1 = __importDefault(require("axios"));
const tokenStore_1 = require("../store/tokenStore");
function authHeaders(token) {
    return {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };
}
function buscarOCrearCliente(nombre, email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const realmId = tokenStore_1.quickbooksTokens.realmId;
        if (!token || !realmId) {
            throw new Error('QuickBooks no autenticado correctamente (token o realmId faltante)');
        }
        const query = `select * from Customer where DisplayName='${nombre}'`;
        const res = yield axios_1.default.get(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`, { headers: authHeaders(token) });
        if (((_a = res.data.QueryResponse.Customer) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return res.data.QueryResponse.Customer[0];
        }
        const createRes = yield axios_1.default.post(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/customer`, {
            DisplayName: nombre,
            PrimaryEmailAddr: { Address: email }
        }, { headers: authHeaders(token) });
        return createRes.data.Customer;
    });
}
function buscarOCrearProducto(nombre, token) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const realmId = tokenStore_1.quickbooksTokens.realmId;
        if (!token || !realmId) {
            throw new Error('QuickBooks no autenticado correctamente (token o realmId faltante)');
        }
        const query = `select * from Item where Name='${nombre}'`;
        const res = yield axios_1.default.get(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/query?query=${encodeURIComponent(query)}`, { headers: authHeaders(token) });
        if (((_a = res.data.QueryResponse.Item) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            return res.data.QueryResponse.Item[0];
        }
        const createRes = yield axios_1.default.post(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/item`, {
            Name: nombre,
            Type: 'Service',
            IncomeAccountRef: {
                value: '79',
                name: 'Sales of Product Income'
            }
        }, { headers: authHeaders(token) });
        return createRes.data.Item;
    });
}
function crearFacturaQuickBooks(factura, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const realmId = tokenStore_1.quickbooksTokens.realmId;
        if (!accessToken || !realmId) {
            throw new Error('QuickBooks no autenticado correctamente (token o realmId faltante)');
        }
        const res = yield axios_1.default.post(`https://sandbox-quickbooks.api.intuit.com/v3/company/${realmId}/invoice`, factura, {
            headers: Object.assign(Object.assign({}, authHeaders(accessToken)), { 'Content-Type': 'application/json' })
        });
        return res.data;
    });
}
