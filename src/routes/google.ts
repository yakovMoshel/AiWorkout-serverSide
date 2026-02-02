import { Router } from 'express';
import { getOAuthClient } from '../api/utils/googleOAuth';

const router = Router();

// התחברות ל־Google
router.get('/connect', (req, res) => {
  const oauthClient = getOAuthClient();

  const url = oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI_PROD, // חשוב: מפורש
  });

  console.log('Redirecting user to Google OAuth URL:', url);
  res.redirect(url);
});

// callback מ־Google
router.get('/callback', async (req, res, next): Promise<void> => {
  console.log('Callback query:', req.query);
  const code = req.query.code as string;

  if (!code) {
    console.error('No code received in callback');
    res.status(400).send('Missing code from Google OAuth');
    return;
  }

  try {
    const oauthClient = getOAuthClient();

    // אין צורך לשנות redirectUri, נעבור דרך הפרמטר בעת יצירת הלקוח
    const { tokens } = await oauthClient.getToken(code);

    console.log('Received tokens from Google:', tokens);
    res.redirect('/settings?google=connected');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('OAuth failed');
  }
});

export default router;
