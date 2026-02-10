import { google } from 'googleapis';
import User from '../models/User';

export function getOAuthClient() {
  const redirectUri =
    process.env.NODE_ENV === 'production'
      ? process.env.GOOGLE_REDIRECT_URI_PROD
      : process.env.GOOGLE_REDIRECT_URI_DEV;

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
  return client;
}


export async function getOAuthClientForUser(userId: string) {
  const user = await User.findById(userId);

  if (!user || !user.googleTokens) {
    throw new Error('User has no Google tokens');
  }

  const oauthClient = getOAuthClient();

  oauthClient.setCredentials(user.googleTokens);

  return oauthClient;
}