import { Router } from 'express';
import { getOAuthClient } from '../api/utils/googleOAuth';

const router = Router();

// שלב 1: הפניית משתמש ל-Google להתחברות
router.get('/connect', (req, res) => {
  const oauthClient = getOAuthClient();

  const url = oauthClient.generateAuthUrl({
    access_type: 'offline', 
    prompt: 'consent',      
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  res.redirect(url);
});

// שלב 2: callback אחרי שהמשתמש מאשר ב-Google
router.get('/callback', async (req, res) => {
  try {
    const oauthClient = getOAuthClient();
    const code = req.query.code as string;
    console.log('Callback query:', req.query);

    if (!code) {
      console.error('No code received in callback');
      res.status(400).send('Missing code from Google OAuth');
      return;
    }

    // ניסיון לקבל tokens
    const { tokens } = await oauthClient.getToken(code);

    oauthClient.setCredentials(tokens);

    console.log('Google OAuth tokens:', tokens);

    // ניתן לשמור את tokens בבסיס הנתונים או ב-session
    // לדוגמה: await saveTokensToDB(tokens);

    res.redirect('/settings?google=connected');
  } catch (err) {
    console.error('Error in Google OAuth callback:', err);
    res.status(500).send('OAuth failed');
  }
});

export default router;
