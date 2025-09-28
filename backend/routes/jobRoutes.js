const express = require("express");
const Job = require("../models/Job");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsFromAPI,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// -------- Protected Routes --------
router.get("/my-jobs", protect, async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching myjobs:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api-jobs", getJobsFromAPI); // fetch from external API

// -------- Public / Dynamic Routes --------
router.get("/:id", getJobById); // dynamic route last
router.get("/", getJobs);       // root route can be last

// -------- CRUD Protected Routes --------
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
