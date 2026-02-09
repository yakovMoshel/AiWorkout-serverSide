import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { connectGoogle, googleCallback } from '../api/controller/googleController';
import { getOAuthClientForUser } from '../api/utils/googleOAuth';
import { google } from 'googleapis';

const router = Router();

// התחברות ל־Google
router.get('/connect', connectGoogle);

// callback מ־Google
router.get('/callback', authenticate, googleCallback);

router.post('/create-workout-event', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const oauthClient = await getOAuthClientForUser(user.id);

    const calendar = google.calendar({
      version: 'v3',
      auth: oauthClient,
    });

    const event = {
      summary: '💪 Workout Session',
      description: 'AI Workout training session',
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'Asia/Jerusalem',
      },
      end: {
        dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        timeZone: 'Asia/Jerusalem',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    res.json({
      message: 'Workout event created',
      link: response.data.htmlLink,
    });

  } catch (err) {
    console.error('Create event error:', err);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

export default router;
