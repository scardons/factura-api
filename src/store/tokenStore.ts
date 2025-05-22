// src/store/tokenStore.ts
import { pool } from '../config/db';

interface QuickbooksTokens {
  access_token: string | null;
  refresh_token: string | null;
  realmId: string | null;
  expiry: number | null;
}

// Guarda los tokens en la tabla tokens
export async function guardarTokens(tokens: {
  access_token: string;
  refresh_token: string;
  realmId: string;
  expiry: number;
}): Promise<void> {
  const { access_token, refresh_token, realmId, expiry } = tokens;
  await pool.query(
    `INSERT INTO tokens (access_token, refresh_token, realm_id, expiry) VALUES ($1, $2, $3, $4)`,
    [access_token, refresh_token, realmId, expiry]
  );
}

// Obtiene el token más reciente (por created_at)
export async function cargarTokens(): Promise<QuickbooksTokens | null> {
  const res = await pool.query(`SELECT * FROM tokens ORDER BY created_at DESC LIMIT 1`);
  if (res.rowCount === 0) return null;

  const row = res.rows[0];
  return {
    access_token: row.access_token,
    refresh_token: row.refresh_token,
    realmId: row.realm_id,
    expiry: Number(row.expiry),
  };
}

// Actualiza los tokens (guardando uno nuevo)
export async function setTokens(
  access_token: string,
  refresh_token: string,
  realmId: string,
  expires_in: number
): Promise<void> {
  const expiry = Date.now() + expires_in * 1000;
  await guardarTokens({ access_token, refresh_token, realmId, expiry });
}

// Obtiene el refresh token del último registro
export async function getRefreshToken(): Promise<string | null> {
  const tokens = await cargarTokens();
  return tokens?.refresh_token || null;
}

// Obtiene la fecha de expiración del último token
export async function getTokenExpiry(): Promise<number> {
  const tokens = await cargarTokens();
  return tokens?.expiry || 0;
}
