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
    try {
      const today = getTodayAbbr();

      const users = await User.find({ trainingDays: today }, "_id").lean();

      const results = await Promise.allSettled(
        users.map((user) =>
          sendPushToUser(String(user._id), {
            title: "Workout time! 💪",
            body: "Today is your training day. Let's go!",
          })
        )
      );

      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) {
        console.error(`Workout reminder cron: ${failed}/${users.length} push notifications failed`);
      }
    } catch (err) {
      console.error("Workout reminder cron failed:", err);
    }
  });
}
