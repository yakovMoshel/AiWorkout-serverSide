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

    const { tokens } = await oauthClient.getToken(code);

    console.log(tokens);

    // TODO: save tokens.refresh_token to DB for req.user.id

    res.redirect('http://localhost:3000/settings?google=connected');

  } catch (err) {
    console.error(err);
    res.status(500).send('OAuth failed');
  }
});

export default router;
