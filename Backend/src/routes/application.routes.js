import { Router } from "express";
import { auth } from "../middleware/auth.js";
import applicationController from "../controller/application.controller.js";
import { uploadResume } from "../middleware/upload.js";
import { permit } from "../middleware/roles.js";

const applicationRouter = Router();

applicationRouter.post(
  "/api/v1/job/apply",
  auth,
  permit("JOB_SEEKER"),
  uploadResume.single("resume"),
  applicationController.applyToJob
);

applicationRouter.get(
  "/api/v1/job/apply/get/applicants/:jobId",
  auth,
  permit("JOB_POSTER", "ADMIN"),
  applicationController.listApplicantsForJob
);

applicationRouter.get(
  "/api/v1/job/apply/myApplication",
  auth,
  permit("JOB_SEEKER"),
  applicationController.myApplications
);

export default applicationRouter;
