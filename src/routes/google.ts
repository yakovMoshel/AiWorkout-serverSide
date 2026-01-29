import { Router } from 'express';
import { getOAuthClient } from '../api/utils/googleOAuth';

const router = Router();

router.get('/connect', (req, res) => {
  const oauthClient = getOAuthClient();

  const url = oauthClient.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  res.redirect(url);
});

router.get('/callback', async (req, res) => {
  try {
    const oauthClient = getOAuthClient();
    const code = req.query.code as string;

    const { tokens } = await oauthClient.getToken(code);

    console.log(tokens);
    res.redirect('/settings?google=connected');
  } catch (err) {
    console.error(err);
    res.status(500).send('OAuth failed');
  }
});

export default router;
