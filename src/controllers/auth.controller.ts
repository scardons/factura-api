import { Request, Response } from 'express';
const OAuthClient = require('intuit-oauth');

const oauthClient = new OAuthClient({
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!,
  environment: process.env.ENVIRONMENT || 'sandbox',
  redirectUri: process.env.REDIRECT_URI!
});

export const getAuthUrl = (req: Request, res: Response) => {
  const authUri = oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: 'someRandomState'
  });
  res.redirect(authUri);  // o envías la URL para que el frontend redirija
};

export const handleCallback = async (req: Request, res: Response) => {
  try {
    const authResponse = await oauthClient.createToken(req.url);
    // Guarda authResponse.getJson() con access_token y refresh_token donde prefieras
    res.json(authResponse.getJson());
  } catch (error) {
    res.status(500).json({ error: 'OAuth callback failed', details: error });
  }
};
