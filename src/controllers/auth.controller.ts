// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
const OAuthClient = require('intuit-oauth');
import { obtenerTokensQuickBooks } from '../services/auth.service';
import { quickbooksTokens, setTokens } from '../store/tokenStore';

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

    const tokenData = await obtenerTokensQuickBooks(code, realmId);

    quickbooksTokens.access_token = tokenData.access_token;
    quickbooksTokens.refresh_token = tokenData.refresh_token;
    quickbooksTokens.realmId = realmId;

    setTokens(tokenData.access_token, tokenData.refresh_token, realmId, tokenData.expires_in);

    console.log('🎯 Tokens guardados:', quickbooksTokens);
    res.json({ message: 'Autenticado con éxito', tokens: quickbooksTokens });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({
      error: 'OAuth callback failed',
      details: error instanceof Error ? error.message : error
    });
  }
};
