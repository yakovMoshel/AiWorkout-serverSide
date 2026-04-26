import mongoose from "mongoose";

interface IPushSubscription {
  userId: mongoose.Schema.Types.ObjectId;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: Date;
}

const pushSubscriptionSchema = new mongoose.Schema<IPushSubscription>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPushSubscription>(
  "PushSubscription",
  pushSubscriptionSchema
);
