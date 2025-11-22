import Application from "../model/Application.js";
import JobPost from "../model/JobPost.js";

const applicationController = {
  applyToJob: async (req, res) => {
    const applicantId = req.user.id;
    const { jobId, coverLetter } = req.body;

    const job = await JobPost.findById(jobId).populate("organization");
    if (!job || job.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Job not found or not open for applications",
      });
    }

    const resumeUrl = req.file
      ? `/uploads/resumes/${req.file.filename}`
      : undefined;

    const application = await Application.create({
      job: job._id,
      applicant: applicantId,
      coverLetter,
      resumeUrl,
    });

    //!Increase the applied count by one
    job.appliedCount = job.appliedCount + 1;
    await job.save();

    res
      .status(201)
      .json({ message: "Application submitted", data: application });
    try {
    } catch (e) {
      console.log("Cannot apply for the job", e);
      res.status(400).json({ Message: "Internal server error" });
    }
  },

  //*For job poster: List applicants for my job
  listApplicantsForJob: async (req, res) => {
    try {
      const posterId = req.user.id;
      const { jobId } = req.params;

      if (!posterId) {
        return res.status(400).json({ message: "Job poster ID not found" });
      }

      if (!{ jobId }) {
        return res.status(400).json({ message: "Job Id not found" });
      }

      const job = await JobPost.findById(jobId);
      if (!job)
        return res
          .status(404)
          .json({ success: false, message: "Job not found" });
      if (String(job.createdBy) !== String(posterId)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const apps = await Application.find({ job: jobId })
        .sort({ createdAt: -1 })
        .populate("applicant", "email role profile organization");

      res.status(200).json({ data: apps });
    } catch (e) {
      console.log("Applicants loading error for the job", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //* Job Seeker: my applications
  myApplications: async (req, res) => {
    try {
      const apps = await Application.find({ applicant: req.user.id });

      if (!apps) {
        res.status(400).json({ message: "No application found" });
      }

      res.status(200).json({ data: apps });
    } catch (e) {
      console.log("Cannot load my application", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default applicationController;
