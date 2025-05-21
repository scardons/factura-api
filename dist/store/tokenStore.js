"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickbooksTokens = void 0;
exports.cargarTokens = cargarTokens;
exports.guardarTokens = guardarTokens;
exports.setTokens = setTokens;
exports.getRefreshToken = getRefreshToken;
exports.getTokenExpiry = getTokenExpiry;
// src/store/tokenStore.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tokenFilePath = path_1.default.resolve(__dirname, 'quickbooksTokens.json');
let quickbooksTokens = {
    access_token: null,
    refresh_token: null,
    realmId: null,
    expiry: null,
};
exports.quickbooksTokens = quickbooksTokens;
function cargarTokens() {
    if (fs_1.default.existsSync(tokenFilePath)) {
        const data = fs_1.default.readFileSync(tokenFilePath, 'utf-8');
        exports.quickbooksTokens = quickbooksTokens = JSON.parse(data);
    }
}
function guardarTokens() {
    fs_1.default.writeFileSync(tokenFilePath, JSON.stringify(quickbooksTokens, null, 2));
}
function setTokens(access_token, refresh_token, realmId, expires_in) {
    quickbooksTokens.access_token = access_token;
    quickbooksTokens.refresh_token = refresh_token;
    quickbooksTokens.realmId = realmId;
    quickbooksTokens.expiry = Date.now() + expires_in * 1000;
    guardarTokens();
}
function getRefreshToken() {
    return quickbooksTokens.refresh_token;
}
function getTokenExpiry() {
    return quickbooksTokens.expiry || 0;
}
