import { Request, Response } from "express";
import PushSubscription from "../models/PushSubscription";

export async function subscribe(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;
  const { endpoint, keys } = req.body as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    res.status(400).json({ message: "Invalid subscription payload" });
    return;
  }

  await PushSubscription.findOneAndUpdate(
    { endpoint },
    { userId, endpoint, keys },
    { upsert: true, new: true }
  );

  res.status(201).json({ message: "Subscribed" });
}

export async function unsubscribe(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;
  const { endpoint } = req.body as { endpoint: string };

  await PushSubscription.deleteOne({ userId, endpoint });

  res.status(200).json({ message: "Unsubscribed" });
}

export async function checkSubscription(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user.id;
  const { endpoint } = req.query as { endpoint: string };

  if (!endpoint) {
    res.status(400).json({ message: "endpoint query param required" });
    return;
  }

  const sub = await PushSubscription.findOne({ userId, endpoint });
  res.status(200).json({ subscribed: !!sub });
}

export function getVapidPublicKey(_req: Request, res: Response): void {
  res.status(200).json({ publicKey: process.env.VAPID_PUBLIC_KEY });
}
