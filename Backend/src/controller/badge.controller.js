import BadgeCatalog from "../model/BadgeCatalog.js";
import EarnedBadge from "../model/EarnedBadge.js";
import AssessmentAttempt from "../model/AssessmentAttempt.js";
import Endorsement from "../model/Endorsement.js";
import { evaluateAndGrantBadge } from "../rules/skillBadgeRules.js";

const badgeController = {
  //! --- Admin: create badge type
  createBadgeType: async (req, res) => {
    try {
      const doc = await BadgeCatalog.create(req.body);
      res.status(201).json({ message: "Badge type created", data: doc });
    } catch (e) {
      console.log("Error creating badge type", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //! --- Public: list badge types
  listBadgeTypes: async (req, res) => {
    try {
      const list = await BadgeCatalog.find({ enabled: true }).sort({
        title: 1,
      });

      if (!list) {
        return res.status(400).json({ message: "Badge lst not found" });
      }

      res.status(200).json({ data: list });
    } catch (e) {
      console.log("Error listing badge types", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //! --- Seeker: submit assessment score (short quiz/task scored on client or server)
  submitAssessment: async (req, res) => {
    try {
      const { badgeKey, score, evidenceUrls } = req.body;
      if (score < 0 || score > 100)
        return res
          .status(400)
          .json({ success: false, message: "Score must be 0..100" });

      const attempt = await AssessmentAttempt.create({
        user: req.user.id,
        badge: await (await BadgeCatalog.findOne({ key: badgeKey }))._id,
        score,
        passed: score >= 50, // baseline pass (your logic may vary)
        evidenceUrls: evidenceUrls || [],
      });

      const evalRes = await evaluateAndGrantBadge({
        userId: req.user.id,
        badgeKey,
        assessmentScore: score,
      });

      res.status(201).json({
        status: 201,
        message: evalRes.granted
          ? "Assessment recorded and badge granted/updated"
          : "Assessment recorded",
        data: { attempt, evaluation: evalRes },
      });
    } catch (e) {
      console.log("Error Submitting assessment", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getUserBadges: async (req, res) => {
    try {
      const { userId } = req.params;
      const badges = await EarnedBadge.find({ user: userId }).populate("badge");

      if (!badges) {
        return res
          .status(400)
          .json({ message: "No badges found for the user" });
      }

      res.status(200).json({ data: badges });
    } catch (e) {
      console.log("Error Error getting badges for the profile", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  //! --- Poster: endorse a seeker (optionally tie to a job)
  endorseUser: async (req, res) => {
    try {
      const { endorsedUserId, badgeKey, jobId, comment, rating } = req.body;
      const catalog = await BadgeCatalog.findOne({
        key: badgeKey,
        enabled: true,
      });
      if (!catalog)
        return res
          .status(404)
          .json({ success: false, message: "Badge type not found" });

      const endorsement = await Endorsement.create({
        endorsedUser: endorsedUserId,
        endorsedBy: req.user.id,
        job: jobId || undefined,
        badge: catalog._id,
        comment: comment || "",
        rating: rating || 5,
      });

      // After endorsement, evaluate for possible badge grant
      const evalRes = await evaluateAndGrantBadge({
        userId: endorsedUserId,
        badgeKey,
      });
      res.status(201).json({
        status: 201,
        message: "Endorsement recorded",
        data: { endorsement, evaluation: evalRes },
      });
    } catch (e) {
      console.log("Error endorse a seeker", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default badgeController;
