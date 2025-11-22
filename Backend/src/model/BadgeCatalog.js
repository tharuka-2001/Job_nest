import mongoose from "mongoose";

const badgeCatalogSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      required: true,
    }, // e.g., 'carpenter', 'tailor', 'driver'
    title: {
      type: String,
      required: true,
    }, // Display name
    description: String,
    icon: String, // optional icon url
    // Optional difficulty levels or recommended criteria
    recommendedMinEndorsements: {
      type: Number,
      default: 2,
    },
    passingScore: {
      type: Number,
      default: 70,
    }, // for assessments
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BadgeCatalog = mongoose.model("BadgeCatalog", badgeCatalogSchema);
export default BadgeCatalog;
