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
exports.guardarTokens = guardarTokens;
exports.cargarTokens = cargarTokens;
exports.setTokens = setTokens;
exports.getRefreshToken = getRefreshToken;
exports.getTokenExpiry = getTokenExpiry;
// src/store/tokenStore.ts
const db_1 = require("../config/db");
// Guarda los tokens en la tabla tokens
function guardarTokens(tokens) {
    return __awaiter(this, void 0, void 0, function* () {
        const { access_token, refresh_token, realmId, expiry } = tokens;
        yield db_1.pool.query(`INSERT INTO tokens (access_token, refresh_token, realm_id, expiry) VALUES ($1, $2, $3, $4)`, [access_token, refresh_token, realmId, expiry]);
    });
}
// Obtiene el token más reciente (por created_at)
function cargarTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield db_1.pool.query(`SELECT * FROM tokens ORDER BY created_at DESC LIMIT 1`);
        if (res.rowCount === 0)
            return null;
        const row = res.rows[0];
        return {
            access_token: row.access_token,
            refresh_token: row.refresh_token,
            realmId: row.realm_id,
            expiry: Number(row.expiry),
        };
    });
}
// Actualiza los tokens (guardando uno nuevo)
function setTokens(access_token, refresh_token, realmId, expires_in) {
    return __awaiter(this, void 0, void 0, function* () {
        const expiry = Date.now() + expires_in * 1000;
        yield guardarTokens({ access_token, refresh_token, realmId, expiry });
    });
}
// Obtiene el refresh token del último registro
function getRefreshToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const tokens = yield cargarTokens();
        return (tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token) || null;
    });
}
// Obtiene la fecha de expiración del último token
function getTokenExpiry() {
    return __awaiter(this, void 0, void 0, function* () {
        const tokens = yield cargarTokens();
        return (tokens === null || tokens === void 0 ? void 0 : tokens.expiry) || 0;
    });
}
