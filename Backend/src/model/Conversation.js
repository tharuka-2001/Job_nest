import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    job: { type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }, // optional: link to a job post
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 }); // helps lookup
const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
