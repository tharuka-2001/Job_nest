import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to mongo db successfully ✅"))
    .catch((err) => console.log("Error connecting to mongo DB  ❌", err));
};
