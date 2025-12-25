"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleOAuth_1 = require("../api/utils/googleOAuth");
const router = (0, express_1.Router)();
// START LOGIN FLOW
router.get('/connect', (req, res) => {
    const url = googleOAuth_1.oauthClient.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: ['https://www.googleapis.com/auth/calendar']
    });
    res.redirect(url);
});
// CALLBACK
router.get('/callback', async (req, res) => {
    try {
        const code = req.query.code;
        const { tokens } = await googleOAuth_1.oauthClient.getToken(code);
        console.log(tokens);
        // TODO: save tokens.refresh_token to DB for req.user.id
        res.redirect('http://localhost:3000/settings?google=connected');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('OAuth failed');
    }
});
exports.default = router;
