import mongoose from "mongoose";

const endorsementSchema = new mongoose.Schema(
  {
    endorsedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    endorsedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // job poster
    job: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }, // optional link to job
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BadgeCatalog",
      required: true,
    },
    comment: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
  },
  { timestamps: true }
);

// prevent duplicate endorsements for same pair/badge within same job
endorsementSchema.index(
  { endorsedUser: 1, endorsedBy: 1, badge: 1, job: 1 },
  { unique: true }
);

const Endorsement = mongoose.model("Endorsement", endorsementSchema);
export default Endorsement;
