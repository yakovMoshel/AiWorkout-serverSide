import { Request, Response } from 'express';
import { generateGoogleAuthUrl, handleGoogleCallback } from '../services/googleService';

export const connectGoogle = (req: Request, res: Response): void => {
  try {
    const url = generateGoogleAuthUrl();
    console.log('Redirecting user to Google OAuth URL:', url);
    res.redirect(url);
  } catch (err) {
    console.error('Google connect error:', err);
    res.status(500).send('Failed to generate Google OAuth URL');
  }
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Callback query:', req.query);
    const code = req.query.code as string;

    if (!code) {
      console.error('No code received in callback');
      res.status(400).send('Missing code from Google OAuth');
      return;
    }

    const user = (req as any).user;
    const userId = user.id;

    await handleGoogleCallback(code, userId);
    res.redirect('/settings?google=connected');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('OAuth failed');
  }
};
