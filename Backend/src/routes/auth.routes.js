import express from "express";
import authController from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/api/v1/auth/register", authController.Register);
authRouter.post("/api/v1/auth/login", authController.Login);
export default authRouter;
