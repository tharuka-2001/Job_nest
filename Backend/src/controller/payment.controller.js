import { stripe } from "../config/stripe.js";
import JobPost from "../model/JobPost.js";
import Payment from "../model/Payment.js";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("❌ Missing STRIPE_WEBHOOK_SECRET");
    return res.status(500).send("Webhook secret not configured");
  }
  if (!sig) {
    console.error("❌ Missing stripe-signature header");
    return res.status(400).send("Missing signature");
  }

  let event;
  try {
    // IMPORTANT: req.body is a Buffer because of express.raw()
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { jobId } = session.metadata || {};
    await Payment.findOneAndUpdate(
      { providerPaymentId: session.id },
      { status: "succeeded", raw: session },
      { new: true }
    );
    if (jobId) await JobPost.findByIdAndUpdate(jobId, { status: "published" });
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object;
    const { jobId } = session.metadata || {};
    await Payment.findOneAndUpdate(
      { providerPaymentId: session.id },
      { status: "failed", raw: session }
    );
    if (jobId)
      await JobPost.findByIdAndUpdate(jobId, { status: "failed_payment" });
  }

  res.json({ received: true });
};
