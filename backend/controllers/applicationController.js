const Application = require("../models/Application");
const Job = require("../models/Job");

// ---------------- Apply for a Job (Candidate) ----------------
const applyJob = async (req, res) => {
  const { id } = req.params; // job id
  const resume = req.file;
  const { name, email } = req.body; // ✅ frontend se aayega

  if (!resume) return res.status(400).json({ message: "Resume file is required" });

  try {
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // check if candidate already applied
    let application = await Application.findOne({ job: id, candidate: req.user._id });

    const resumePath = `/uploads/${resume.filename}`;

    if (application) {
      // ✅ update existing application
      application.name = name;
      application.email = email;
      application.resume = resumePath;
      await application.save();
      return res.status(200).json({ message: "Application updated", application });
    }

    // ✅ create new application
    application = new Application({
      job: id,
      candidate: req.user._id,
      name,
      email,
      resume: resumePath,
    });

    await application.save();
    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- Get candidate's applications ----------------
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user._id })
      .populate("job", "title company location description")
      .populate("candidate", "name email");

    res.status(200).json(apps);
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- Get applicants for a job (Recruiter) ----------------
const getApplicantsForRecruiterJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.recruiter.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const apps = await Application.find({ job: jobId })
      .populate("candidate", "name email")
      .populate("job", "title company");

    res.status(200).json(apps);
  } catch (err) {
    console.error("Get applicants error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- Update application status ----------------
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "accepted", "rejected"];
    if (!allowedStatus.includes(status.toLowerCase()))
      return res.status(400).json({ message: "Invalid status" });

    const app = await Application.findById(applicationId).populate("job");
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (app.job.recruiter.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    app.status = status.toLowerCase();
    await app.save();

    res.status(200).json({ message: "Status updated", application: app });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- Get all applicants across recruiter's jobs ----------------
const getAllApplicantsForRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id }).select("_id");
    const jobIds = jobs.map((j) => j._id);

    const apps = await Application.find({ job: { $in: jobIds } })
      .populate("candidate", "name email")
      .populate("job", "title company location");

    res.status(200).json(apps);
  } catch (err) {
    console.error("Get all applicants error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getApplicantsForRecruiterJob,
  updateApplicationStatus,
  getAllApplicantsForRecruiter,
};
