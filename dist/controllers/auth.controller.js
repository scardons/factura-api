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
exports.handleCallback = exports.getAuthUrl = void 0;
const OAuthClient = require('intuit-oauth');
const auth_service_1 = require("../services/auth.service");
const tokenStore_1 = require("../store/tokenStore");
const oauthClient = new OAuthClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    environment: process.env.ENVIRONMENT || 'sandbox',
    redirectUri: process.env.REDIRECT_URI
});
const getAuthUrl = (req, res) => {
    const authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting],
        state: 'someRandomState'
    });
    console.log('➡️ Auth URI:', authUri);
    res.redirect(authUri);
};
exports.getAuthUrl = getAuthUrl;
const handleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        const realmId = req.query.realmId;
        if (!code || !realmId) {
            res.status(400).json({ error: 'Faltan parámetros code o realmId' });
            return;
        }
        console.log('🔄 Código recibido:', code);
        console.log('🔄 RealmId recibido:', realmId);
        const tokenData = yield (0, auth_service_1.obtenerTokensQuickBooks)(code, realmId);
        tokenStore_1.quickbooksTokens.access_token = tokenData.access_token;
        tokenStore_1.quickbooksTokens.refresh_token = tokenData.refresh_token;
        tokenStore_1.quickbooksTokens.realmId = realmId;
        (0, tokenStore_1.setTokens)(tokenData.access_token, tokenData.refresh_token, realmId, tokenData.expires_in);
        console.log('🎯 Tokens guardados:', tokenStore_1.quickbooksTokens);
        res.json({ message: 'Autenticado con éxito', tokens: tokenStore_1.quickbooksTokens });
    }
    catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).json({
            error: 'OAuth callback failed',
            details: error instanceof Error ? error.message : error
        });
    }
});
exports.handleCallback = handleCallback;
