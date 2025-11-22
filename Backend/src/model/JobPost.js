import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    appliedCount: {
      type: Number,
      default: 0,
    },

    salaryRange: {
      min: Number,
      max: Number,
      currency: String,
    },
    status: {
      type: String,
      enum: ["draft", "pending_payment", "published", "failed_payment"],
      default: "draft",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  },
  { timestamps: true }
);

const JobPost = mongoose.model("JobPost", jobPostSchema);
export default JobPost;
