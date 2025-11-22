import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import badgeController from "../controller/badge.controller.js";

const badgeRouter = Router();

//! Admin manages catalog
badgeRouter.post(
  "/api/v1/badges/catalog",
  auth,
  permit("ADMIN"),
  badgeController.createBadgeType
);
//! Public list of badge types (for UI)
badgeRouter.get("/api/v1/badges/catalog", badgeController.listBadgeTypes);

//! Job seeker submits assessment for a badge
badgeRouter.post(
  "/api/v1/badges/assess",
  auth,
  permit("JOB_SEEKER"),
  badgeController.submitAssessment
);

//! Job poster endorses a seeker
badgeRouter.post(
  "/api/v1/badges/endorse",
  auth,
  permit("JOB_POSTER", "ADMIN"),
  badgeController.endorseUser
);

//! Public/user: list badges on a profile
badgeRouter.get("/api/v1/badges/user/:userId", badgeController.getUserBadges);

export default badgeRouter;
