import { Router } from 'express';
import { oauthClient } from '../api/utils/googleOAuth';

const router = Router();


// START LOGIN FLOW
router.get('/connect', (req, res) => {
  const url = oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar']
  });

  res.redirect(url);
});


// CALLBACK
router.get('/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) throw new Error('No code from Google');

    const { tokens } = await oauthClient.getToken(code);
    console.log('✅ TOKENS:', tokens);

    const frontendUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_PROD
        : process.env.FRONTEND_DEV;

    res.redirect(`${frontendUrl}/settings?google=connected`);
  } catch (err) {
    console.error('❌ OAUTH ERROR', err);
    res.status(500).send('OAuth failed');
  }
});


export default router;
