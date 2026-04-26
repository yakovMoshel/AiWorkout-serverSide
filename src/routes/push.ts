import express from "express";
import { authenticate } from "../middleware/auth";
import {
  subscribe,
  unsubscribe,
  checkSubscription,
  getVapidPublicKey,
} from "../api/controller/pushController";

const router = express.Router();

router.get("/vapid-public-key", getVapidPublicKey);
router.post("/subscribe", authenticate, subscribe);
router.delete("/unsubscribe", authenticate, unsubscribe);
router.get("/subscription-status", authenticate, checkSubscription);

export default router;
