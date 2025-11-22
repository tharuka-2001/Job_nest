import { Router } from "express";
import profileController from "../controller/profile.controller.js";
import { auth } from "../middleware/auth.js";
const profileRouter = Router();

profileRouter.get("/api/v1/profile/me", auth, profileController.getMe);
profileRouter.put(
  "/api/v1/profile/updateProfile",
  auth,
  profileController.updateProfile
);

export default profileRouter;
