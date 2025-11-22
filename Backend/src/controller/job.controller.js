import JobPost from "../model/JobPost.js";
import Payment from "../model/Payment.js";
import Organization from "../model/Organization.js";
import { stripe } from "../config/stripe.js";

const jobController = {
  createJobAndPay: async (req, res) => {
    try {
      const userId = req.user.id;
      const org = await Organization.find({ owner: userId });
      let orgId = null;

      if (org) {
        orgId = org._id;
      }
      const job = await JobPost.create({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        category: req.body.category,
        salaryRange: req.body.salaryRange,
        status: "pending_payment",
        organization: orgId,
        createdBy: userId,
      });

      const amount = parseInt(process.env.JOB_POST_PRICE_LKR || "50000", 10);
      const currency = process.env.CURRENCY || "usd";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: { name: `Rural Jobs – Post: ${job.title}` },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.PRIMARY_CLIENT_URL}/jobs/jobposterjobs`,
        cancel_url: `${process.env.PRIMARY_CLIENT_URL}/jobs/submit-cancel?jobId=${job._id}`,

        metadata: { jobId: String(job._id), userId },
      });

      const payment = await Payment.create({
        provider: "stripe",
        providerPaymentId: session.id,
        amount,
        currency,
        status: "requires_payment",
        jobPost: job._id,
        payer: userId,
        raw: session,
      });

      job.payment = payment._id;
      await job.save();

      res.status(201).json({
        status: 201,
        message: "Payment required. Redirect to checkout",
        data: { checkoutUrl: session.url, jobId: job._id },
      });
    } catch (e) {
      console.log("Cannot create a job", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  listJobs: async (req, res) => {
    try {
      const jobs = await JobPost.find({ status: "published" }).sort({
        createdAt: -1,
      });

      if (jobs.length < 0) {
        return res.status(404).json({ message: "No jobs ara available" });
      }

      res.status(200).json({
        data: jobs,
      });
    } catch (e) {
      console.log("Cannot find jobs", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getSingleJob: async (req, res) => {
    try {
      const job = await JobPost.findById({ _id: req.params.id });

      if (!job) {
        return res.status(404).json({ message: "Selected job not found" });
      }

      res.status(200).json({ data: job });
    } catch (e) {
      console.log("Cannot find jobs", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  updateJob: async (req, res) => {
    try {
      const job = await JobPost.findOne({
        _id: req.params.id,
        createdBy: req.user.id,
      }).populate("payment");
      if (!job)
        return res
          .status(404)
          .json({ success: false, message: "Job not found" });
      if (job.status === "published") {
        return res
          .status(400)
          .json({ success: false, message: "Cannot edit a published job" });
      }

      const updatable = [
        "title",
        "description",
        "location",
        "salaryRange",
        "category",
      ];
      updatable.forEach((k) => {
        if (req.body[k] !== undefined) job[k] = req.body[k];
      });
      await job.save();
      res.status(200).json({
        message: "Job has been updated",
        data: job,
      });
    } catch (e) {
      console.log("Cannot update job", e);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getRecommendedJobs: async (req, res) => {},
  // DELETE /jobs/:id
  deleteJob: async (req, res) => {
    try {
      const jobId = req.params.id;

      // Load the job and (optionally) its payment
      const job = await JobPost.findById(jobId).populate("payment");
      if (!job) {
        return res
          .status(404)
          .json({ success: false, message: "Job not found" });
      }

      const isOwner = String(job.createdBy) === String(req.user.id);
      const isAdmin = req.user?.role === "ADMIN";
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      // Prevent deleting published jobs (unless ADMIN)
      // if (job.status === "published" && !isAdmin) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Cannot delete a published job",
      //   });
      // }

      // If there is a linked Payment, handle cleanup
      // - If payment succeeded, block deletion unless ADMIN (so you don’t orphan accounting)
      // - Otherwise (requires_payment/failed/etc.), delete the payment record
      // if (job.payment) {
      //   const payStatus = job.payment.status;
      //   if (payStatus === "succeeded" && !isAdmin) {
      //     return res.status(400).json({
      //       success: false,
      //       message:
      //         "This job has a successful payment record. Ask an admin to remove it.",
      //     });
      //   }
      //   await Payment.deleteOne({ _id: job.payment._id });
      // }

      // (Optional) If you have an Application model and want to cascade delete:
      // await Application.deleteMany({ job: job._id });

      await JobPost.deleteOne({ _id: job._id });

      return res.status(200).json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (e) {
      console.error("Cannot delete job", e);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};

export default jobController;
