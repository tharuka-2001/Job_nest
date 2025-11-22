import { Router } from "express";
import { stripeWebhook } from "../controller/payment.controller.js";

const router = Router();
// Mounted at /api/webhooks/stripe in app.js
router.post("/", stripeWebhook);

export default router;
