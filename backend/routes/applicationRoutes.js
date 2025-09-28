const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const {
  applyJob,
  getMyApplications,
  getApplicantsForRecruiterJob,
  updateApplicationStatus,
  getAllApplicantsForRecruiter,
} = require("../controllers/applicationController");

// Multer setup for resume
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Candidate applies for job
router.post("/apply/:id", protect, upload.single("resume"), applyJob);

// Candidate sees own applications
router.get("/my-applications", protect, getMyApplications);

// Recruiter sees applicants for one job
router.get("/job/:jobId", protect, getApplicantsForRecruiterJob);

// Recruiter updates application status
router.patch("/:applicationId/status", protect, updateApplicationStatus);

// Recruiter sees all applicants for their jobs
router.get("/all-applicants", protect, getAllApplicantsForRecruiter);

module.exports = router;
