import { google } from 'googleapis';
import User from '../models/User';

export function getOAuthClient() {
  const redirectUri =
    process.env.NODE_ENV === 'production'
      ? process.env.GOOGLE_REDIRECT_URI_PROD
      : process.env.GOOGLE_REDIRECT_URI_DEV;

  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  console.log("OAuth2Client created:", client._clientId); // ⬅️ בדיקה

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