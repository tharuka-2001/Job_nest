import User from "../model/User.js";

const profileController = {
  getMe: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).populate("organization");

      if (!user) {
        return res.status(400).json({ message: "User profile not found" });
      }

      res.status(200).json({
        data: user,
      });
    } catch (e) {
      console.error("Error fetching user profile:", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateProfile: async (req, res) => {
    const updates = { profile: req.body.profile };
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).populate("organization");

    res.status(200).json({
      message: "User updates successfully",
      data: user,
    });
  },
};

export default profileController;
