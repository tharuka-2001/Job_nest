import Organization from "../model/Organization.js";
import User from "../model/User.js";

const organizationController = {
  createOrganization: async (req, res) => {
    try {
      //*Create the organization
      const org = await Organization.create({
        ...req.body,
        owner: req.user.id,
      });
      //*update the User's organization
      await User.findByIdAndUpdate(req.user.id, { organization: org._id });

      res.status(201).json({
        message: "Organization created successful",
        data: org,
      });
    } catch {
      console.info("Organization crete failed", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  updateOrganization: async (req, res) => {
    try {
      //!Find the particular organization and update
      const org = await Organization.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.id },
        req.body,
        { new: true }
      );
      if (!org)
        return res
          .status(404)
          .json({ success: false, message: "Organization not found" });

      res.status(200).json({
        message: "Organization updated successful",
        data: org,
      });
    } catch (e) {
      console.log("Update organization failed", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  myOrganization: async (req, res) => {
    try {
      const org = await Organization.findOne({ owner: req.user.id });

      if (!org) {
        return res.status(400).json({
          message: `No organization found for the user ${req.user.name}`,
        });
      }

      res.status(200).json({ data: org });
    } catch (e) {
      res.status(500).json({ message: "Internal server error" }, e);
    }
  },
};

export default organizationController;
