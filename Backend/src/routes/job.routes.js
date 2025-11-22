import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import jobController from "../controller/job.controller.js";

const jobRouter = Router();

jobRouter.post(
  "/api/v1/job/create",
  auth,
  permit("JOB_POSTER", "ADMIN"),
  jobController.createJobAndPay
);

jobRouter.get("/api/v1/job/list", auth, jobController.listJobs);

jobRouter.put(
  "/api/v1/job/update/:id",
  auth,
  permit("JOB_POSTER", "ADMIN"),
  jobController.updateJob
);

jobRouter.delete(
  "/api/v1/job/delete/:id",
  auth,
  permit("JOB_POSTER", "ADMIN"),
  jobController.deleteJob
);
export default jobRouter;
