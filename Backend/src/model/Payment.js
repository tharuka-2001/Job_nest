import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["stripe"],
      default: "stripe",
    },
    providerPaymentId: {
      type: String,
      index: true,
    },
    amount: Number, // smallest unit
    currency: String,
    status: {
      type: String,
      enum: ["requires_payment", "succeeded", "failed", "refunded"],
      default: "requires_payment",
    },
    jobPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    raw: Object,
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
