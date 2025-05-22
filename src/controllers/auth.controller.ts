// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
const OAuthClient = require('intuit-oauth');
import { obtenerTokensQuickBooks } from '../services/auth.service';
import { setTokens, cargarTokens } from '../store/tokenStore';

const oauthClient = new OAuthClient({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  environment: process.env.ENVIRONMENT || 'sandbox',
  redirectUri: process.env.REDIRECT_URI!
});

export const getAuthUrl = (req: Request, res: Response): void => {
  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: 'someRandomState'
  });

  console.log('➡️ Auth URI:', authUri);
  res.redirect(authUri);
};

export const handleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code as string | undefined;
    const realmId = req.query.realmId as string | undefined;

    if (!code || !realmId) {
      res.status(400).json({ error: 'Faltan parámetros code o realmId' });
      return;
    }

    console.log('🔄 Código recibido:', code);
    console.log('🔄 RealmId recibido:', realmId);

    // Obtener tokens usando tu servicio, que internamente usa setTokens para guardar
    const tokenData = await obtenerTokensQuickBooks(code, realmId);

    // Ya no modificamos quickbooksTokens directamente; usamos cargarTokens para leer el estado actual
    const tokensGuardados = await cargarTokens();

    console.log('🎯 Tokens guardados:', tokensGuardados);

    res.json({ message: 'Autenticado con éxito', tokens: tokensGuardados });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      error: 'OAuth callback failed',
      details: error instanceof Error ? error.message : error
    });
  }
};
