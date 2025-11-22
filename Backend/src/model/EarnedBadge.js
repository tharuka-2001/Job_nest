import mongoose from "mongoose";

const earnedBadgeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BadgeCatalog",
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: ["basic", "intermediate", "expert"],
      default: "basic",
    },
    // why granted
    source: {
      type: String,
      enum: ["assessment", "endorsements", "manual"],
      required: true,
    },
    score: Number, // assessment score that led to grant
    endorsementsCount: Number, // endorsements that led to grant
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // admin or system
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// one badge type per user (latest wins)
earnedBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

const EarnedBadge = mongoose.model("EarnedBadge", earnedBadgeSchema);
export default EarnedBadge;
