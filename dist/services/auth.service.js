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
exports.obtenerTokensQuickBooks = obtenerTokensQuickBooks;
exports.refrescarTokenQuickBooks = refrescarTokenQuickBooks;
exports.getAccessTokenSeguro = getAccessTokenSeguro;
//src/services/auth.services.ts
const axios_1 = __importDefault(require("axios"));
const tokenStore_1 = require("../store/tokenStore");
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
// Cargar tokens guardados al iniciar el servicio
(0, tokenStore_1.cargarTokens)();
function obtenerTokensQuickBooks(code, realmId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', redirectUri);
        console.log('🟢 Solicitando tokens con código:', code);
        const response = yield axios_1.default.post(url, params, {
            headers: {
                Authorization: `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const { access_token, refresh_token, expires_in } = response.data;
        console.log('🟢 Tokens recibidos:', response.data);
        (0, tokenStore_1.setTokens)(access_token, refresh_token, realmId, expires_in);
        return response.data;
    });
}
function refrescarTokenQuickBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = (0, tokenStore_1.getRefreshToken)();
        if (!refreshToken) {
            console.error('❌ No refresh token disponible');
            throw new Error('No refresh token disponible');
        }
        const realmId = tokenStore_1.quickbooksTokens.realmId;
        if (!realmId) {
            throw new Error('No se encontró realmId para refrescar token');
        }
        const url = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refreshToken);
        const response = yield axios_1.default.post(url, params, {
            headers: {
                Authorization: `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const { access_token, refresh_token, expires_in } = response.data;
        console.log('🔄 Token refrescado:', response.data);
        (0, tokenStore_1.setTokens)(access_token, refresh_token, realmId, expires_in);
        return response.data;
    });
}
function getAccessTokenSeguro() {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenExpiry = (0, tokenStore_1.getTokenExpiry)();
        console.log('⏰ Verificando expiración token:', tokenExpiry, 'ahora:', Date.now());
        if (Date.now() > tokenExpiry - 60000) {
            console.log('⚠️ Token cerca de expirar o expirado, refrescando...');
            yield refrescarTokenQuickBooks();
        }
        else {
            console.log('✅ Token válido, no es necesario refrescar');
        }
        console.log('🔑 Access token actual:', tokenStore_1.quickbooksTokens.access_token);
        return tokenStore_1.quickbooksTokens.access_token;
    });
}
