import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["JOB_SEEKER", "JOB_POSTER", "ADMIN"],
      required: true,
    },
    profile: {
      fullName: String,
      phone: String,
      location: String,
      skills: [String], // for JOB_SEEKER
      avatarUrl: String,
      occupation: String,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    }, // for JOB_POSTER
  },
  { timestamps: true }
);

userSchema.pre("save", async function nextHook(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(15);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password); //Return bool value based on the condition
};

const User = mongoose.model("User", userSchema);
export default User;
