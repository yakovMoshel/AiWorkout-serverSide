import User from "../../models/User";
import { getOAuthClient } from "../../utils/googleOAuth";

export const generateGoogleAuthUrl = (): string => {
    const oauthClient = getOAuthClient();

    const url = oauthClient.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/calendar'],
        redirect_uri: process.env.GOOGLE_REDIRECT_URI_PROD,
    });

    return url;
};

export const handleGoogleCallback = async (
    code: string,
    userId: string
): Promise<void> => {
    if (!code) {
        throw new Error('No code received in callback');
    }

    const oauthClient = getOAuthClient();
    const { tokens } = await oauthClient.getToken(code);

    if (!tokens) {
        throw new Error('No tokens returned from Google');
    }

    await User.findByIdAndUpdate(userId, {
        googleTokens: tokens,
    });

    console.log('Tokens saved for user:', userId);
};

