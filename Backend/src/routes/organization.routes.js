import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import organizationController from "../controller/organization.controller.js";

const organizationRouter = Router();

organizationRouter.post(
  "/api/v1/organization/create",
  auth,
  permit("JOB_POSTER", "ADMIN"),
  organizationController.createOrganization
);
organizationRouter.put(
  "/api/v1/organization/update/:id",
  auth,
  permit("JOB_POSTER", "ADMIN"),
  organizationController.updateOrganization
);
organizationRouter.get(
  "/api/v1/organization/getMyOrganization",
  auth,
  permit("JOB_POSTER", "ADMIN"),
  organizationController.myOrganization
);

export default organizationRouter;
