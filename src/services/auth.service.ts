import axios from 'axios';
import {
  setTokens,
  getRefreshToken,
  getTokenExpiry,
  cargarTokens,
} from '../store/tokenStore';

const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const redirectUri = process.env.REDIRECT_URI!;
const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Cargar tokens guardados al iniciar el servicio (si quieres, puedes hacer esto en otro lugar)
cargarTokens();

export async function obtenerTokensQuickBooks(code: string, realmId: string) {
  const url = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);

  console.log('🟢 Solicitando tokens con código:', code);

  const response = await axios.post(url, params, {
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const { access_token, refresh_token, expires_in } = response.data;

  console.log('🟢 Tokens recibidos:', response.data);

  await setTokens(access_token, refresh_token, realmId, expires_in);

  return response.data;
}

export async function refrescarTokenQuickBooks() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    console.error('❌ No refresh token disponible');
    throw new Error('No refresh token disponible');
  }

  const tokens = await cargarTokens();
  const realmId = tokens?.realmId;
  if (!realmId) {
    throw new Error('No se encontró realmId para refrescar token');
  }

  const url = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  const response = await axios.post(url, params, {
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const { access_token, refresh_token, expires_in } = response.data;
  console.log('🔄 Token refrescado:', response.data);

  await setTokens(access_token, refresh_token, realmId, expires_in);

  return response.data;
}

export async function getAccessTokenSeguro(): Promise<string | null> {
  const tokenExpiry = await getTokenExpiry();
  console.log('⏰ Verificando expiración token:', tokenExpiry, 'ahora:', Date.now());

  if (Date.now() > tokenExpiry - 60000) {
    console.log('⚠️ Token cerca de expirar o expirado, refrescando...');
    await refrescarTokenQuickBooks();
  } else {
    console.log('✅ Token válido, no es necesario refrescar');
  }

  const tokens = await cargarTokens();
  const accessToken = tokens?.access_token || null;
  console.log('🔑 Access token actual:', accessToken);

  return accessToken;
}
export { cargarTokens };

