import User from '../../models/User';
import {
    calculateTotalDuration,
    dayMapping,
    dayToNumber,
    dayToRRule,
    formatWorkoutDescription,
    getFocusArea,
    getNextDayOfWeek
} from '../../utils/workoutHelpers';
import { google } from 'googleapis';
import { Request } from 'express';
import { getOAuthClientForUser } from '../../utils/googleOAuth';


export const createWorkoutEventsService = async (req: Request) => {
    const user = (req as any).user;
    const { trainingTimes } = req.body;
    const userData = await User.findById(user.id);

    if (!userData) {
        throw new Error('User not found.');
    }

    if (!userData.workoutPlan || !userData.trainingDays) {
        throw new Error('No workout plan found. Please complete your profile first.');
    }

    if (trainingTimes) {
        userData.trainingTimes = new Map(Object.entries(trainingTimes));
        await userData.save();
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

        const selectedTime = trainingTimes?.[shortDay] ||
            userData.trainingTimes?.get(shortDay) ||
            '20:00';

        const [hours, minutes] = selectedTime.split(':').map(Number);

        const targetDayNumber = dayToNumber[fullDay];
        const nextDate = getNextDayOfWeek(new Date(), targetDayNumber, hours, minutes);
        const totalDuration = calculateTotalDuration(dayWorkout.exercises);
        const description = formatWorkoutDescription(dayWorkout.exercises);

        const endDate = new Date(nextDate);
        endDate.setDate(endDate.getDate() + (weeksCount * 7));
        const untilDate = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        // Format as local datetime string (no Z) so Google Calendar applies timeZone correctly
        const toLocalISO = (d: Date) => {
            const pad = (n: number) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
        };

        const event = {
            summary: `💪 ${fullDay} - ${getFocusArea(dayWorkout.exercises)}`,
            description: description,
            start: {
                dateTime: toLocalISO(nextDate),
                timeZone: 'Asia/Jerusalem',
            },
            end: {
                dateTime: toLocalISO(new Date(nextDate.getTime() + totalDuration * 60 * 1000)),
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
            time: selectedTime,
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