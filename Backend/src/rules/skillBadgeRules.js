import EarnedBadge from "../model/EarnedBadge.js";
import BadgeCatalog from "../model/BadgeCatalog.js";
import Endorsement from "../model/Endorsement.js";

// Given a user + badgeCatalog doc + optional latest assessment score,
// decide if we should grant/upgrade a badge
export const evaluateAndGrantBadge = async ({
  userId,
  badgeKey,
  assessmentScore = null,
}) => {
  const catalog = await BadgeCatalog.findOne({ key: badgeKey, enabled: true });
  if (!catalog)
    return { granted: false, reason: "Badge not found or disabled" };

  const endorsementsCount = await Endorsement.countDocuments({
    endorsedUser: userId,
    badge: catalog._id,
  });

  // Simple logic (adjust as you like):
  // 1) Assessment-based grant
  if (assessmentScore !== null && assessmentScore >= catalog.passingScore) {
    const level =
      assessmentScore >= 90
        ? "expert"
        : assessmentScore >= 80
        ? "intermediate"
        : "basic";
    const doc = await EarnedBadge.findOneAndUpdate(
      { user: userId, badge: catalog._id },
      {
        source: "assessment",
        score: assessmentScore,
        endorsementsCount,
        level,
        issuedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    return { granted: true, via: "assessment", badge: doc };
  }

  // 2) Endorsement-based grant
  if (endorsementsCount >= catalog.recommendedMinEndorsements) {
    const level =
      endorsementsCount >= catalog.recommendedMinEndorsements + 3
        ? "expert"
        : endorsementsCount >= catalog.recommendedMinEndorsements + 1
        ? "intermediate"
        : "basic";

    const doc = await EarnedBadge.findOneAndUpdate(
      { user: userId, badge: catalog._id },
      {
        source: "endorsements",
        endorsementsCount,
        level,
        issuedAt: new Date(),
      },
      { upsert: true, new: true }
    );
    return { granted: true, via: "endorsements", badge: doc };
  }

  return {
    granted: false,
    reason: "Criteria not met yet",
    endorsementsCount,
    passingScore: catalog.passingScore,
  };
};
