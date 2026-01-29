import { google } from 'googleapis';


const redirectUri =
process.env.NODE_ENV === 'production'
? process.env.GOOGLE_REDIRECT_URI_PROD
: process.env.GOOGLE_REDIRECT_URI_DEV;

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('GOOGLE CLIENT ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE REDIRECT:', redirectUri);

export const oauthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);
