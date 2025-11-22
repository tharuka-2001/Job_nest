import mongoose from "mongoose";

const assessmentAttemptSchema = new mongoose.Schema(
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
    score: { type: Number, required: true }, // 0..100
    passed: { type: Boolean, required: true },
    evidenceUrls: [String], // optional photos/videos uploaded elsewhere
  },
  { timestamps: true }
);

assessmentAttemptSchema.index({ user: 1, badge: 1, createdAt: -1 });

const AssessmentAttempt = mongoose.model(
  "AssessmentAttempt",
  assessmentAttemptSchema
);
export default AssessmentAttempt;
