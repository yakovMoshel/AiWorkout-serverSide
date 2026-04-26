import cron from "node-cron";
import User from "../api/models/User";
import { sendPushToUser } from "../api/services/pushService";

function getTodayAbbr(): string {
  return new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .slice(0, 3);
}

export function startWorkoutReminderCron(): void {
  cron.schedule("0 8 * * *", async () => {
    const today = getTodayAbbr();

    const users = await User.find({ trainingDays: today }, "_id").lean();

    await Promise.all(
      users.map((user) =>
        sendPushToUser(String(user._id), {
          title: "Workout time! 💪",
          body: "Today is your training day. Let's go!",
        })
      )
    );
  });
}
