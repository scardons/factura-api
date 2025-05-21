// src/store/tokenStore.ts
import fs from 'fs';
import path from 'path';

const tokenFilePath = path.resolve(__dirname, 'quickbooksTokens.json');

interface QuickbooksTokens {
  access_token: string | null;
  refresh_token: string | null;
  realmId: string | null;
  expiry: number | null;
}

let quickbooksTokens: QuickbooksTokens = {
  access_token: null,
  refresh_token: null,
  realmId: null,
  expiry: null,
};

export function cargarTokens() {
  if (fs.existsSync(tokenFilePath)) {
    const data = fs.readFileSync(tokenFilePath, 'utf-8');
    quickbooksTokens = JSON.parse(data);
  }
}

export function guardarTokens() {
  fs.writeFileSync(tokenFilePath, JSON.stringify(quickbooksTokens, null, 2));
}

export function setTokens(
  access_token: string,
  refresh_token: string,
  realmId: string,
  expires_in: number
) {
  quickbooksTokens.access_token = access_token;
  quickbooksTokens.refresh_token = refresh_token;
  quickbooksTokens.realmId = realmId;
  quickbooksTokens.expiry = Date.now() + expires_in * 1000;
  guardarTokens();
}

export function getRefreshToken(): string | null {
  return quickbooksTokens.refresh_token;
}

export function getTokenExpiry(): number {
  return quickbooksTokens.expiry || 0;
}

export { quickbooksTokens };
