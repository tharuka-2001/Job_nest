import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: String,
    resumeUrl: String, // path to uploaded resume
    status: {
      type: String,
      enum: ["submitted", "reviewed", "shortlisted", "rejected", "hired"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true }); // one application per job per user

const Application = mongoose.model("Application", applicationSchema);

export default Application;
