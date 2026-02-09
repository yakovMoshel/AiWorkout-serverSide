import { getOAuthClient, getOAuthClientForUser } from '../utils/googleOAuth';
import User from '../models/User';
import {
    calculateTotalDuration,
    dayMapping,
    dayToNumber,
    dayToRRule,
    formatWorkoutDescription,
    getFocusArea,
    getNextDayOfWeek
} from '../utils/workoutHelpers';
import { google } from 'googleapis';

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


export const createWorkoutEventsService = async (req: Request) => {
    const user = (req as any).user;
    const userData = await User.findById(user.id);

    if (!userData) {
        throw new Error('User not found.');
    }

    if (!userData.workoutPlan || !userData.trainingDays) {
        throw new Error('No workout plan found. Please complete your profile first.');
    }

    const oauthClient = await getOAuthClientForUser(user.id);
    const calendar = google.calendar({
        version: 'v3',
        auth: oauthClient,
    });

    const createdEvents = [];
    const exercises = userData.workoutPlan.result.exercises;
    const weeksCount = userData.planDurationWeeks || 8;

    for (const shortDay of userData.trainingDays) {
        const fullDay = dayMapping[shortDay];
        const dayWorkout = exercises.find((ex: any) => ex.day === fullDay);

        if (!dayWorkout?.exercises?.length) {
            console.log(`No workout found for ${fullDay}`);
            continue;
        }

        const targetDayNumber = dayToNumber[fullDay];
        const nextDate = getNextDayOfWeek(new Date(), targetDayNumber);
        const totalDuration = calculateTotalDuration(dayWorkout.exercises);
        const description = formatWorkoutDescription(dayWorkout.exercises);

        const endDate = new Date(nextDate);
        endDate.setDate(endDate.getDate() + (weeksCount * 7));
        const untilDate = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        const event = {
            summary: `💪 ${fullDay} - ${getFocusArea(dayWorkout.exercises)}`,
            description: description,
            start: {
                dateTime: nextDate.toISOString(),
                timeZone: 'Asia/Jerusalem',
            },
            end: {
                dateTime: new Date(nextDate.getTime() + totalDuration * 60 * 1000).toISOString(),
                timeZone: 'Asia/Jerusalem',
            },
            recurrence: [
                `RRULE:FREQ=WEEKLY;BYDAY=${dayToRRule[shortDay]};UNTIL=${untilDate}`
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'popup', minutes: 30 },
                ],
            },
            colorId: '4',
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        createdEvents.push({
            day: fullDay,
            link: response.data.htmlLink,
            startDate: nextDate.toISOString(),
            endDate: endDate.toISOString(),
            recurring: true,
            occurrences: weeksCount,
            exercises: dayWorkout.exercises.map((ex: any) => ex.name),
        });
    }

    return {
        message: `Created ${createdEvents.length} recurring events for ${weeksCount} weeks`,
        events: createdEvents,
    };
};