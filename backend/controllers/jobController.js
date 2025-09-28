const Job = require("../models/Job");
const axios = require("axios");

// ---------------- Create Job (Recruiter only) ----------------
const createJob = async (req, res) => {
    try {
        const { title, description, company, location, salary } = req.body;

        const newJob = new Job({
            title,
            description,
            company,
            location,
            salary,
            recruiter: req.user._id,
        });

        await newJob.save();
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ---------------- Get All Jobs (Public) ----------------
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("recruiter", "name email");
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ---------------- Get Single Job ----------------
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate("recruiter", "name email");
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ---------------- Update Job (Recruiter only) ----------------
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.recruiter.toString() !== req.user._id.toString())
            return res.status(401).json({ message: "Not authorized" });

        const { title, description, company, location, salary } = req.body;
        job.title = title || job.title;
        job.description = description || job.description;
        job.company = company || job.company;
        job.location = location || job.location;
        job.salary = salary || job.salary;

        await job.save();
        res.status(200).json({ message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ---------------- Delete Job (Recruiter only) ----------------
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.recruiter.toString() !== req.user._id.toString())
            return res.status(401).json({ message: "Not authorized" });

        await job.remove();
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ---------------- Fetch Jobs from External API ----------------
// ---------------- Fetch Jobs from External API ----------------
const getJobsFromAPI = async (req, res) => {
    try {
        const keyword = req.query.keyword || "developer"; // default query agar empty ho
        const API_KEY = process.env.EXTERNAL_JOBS_API_KEY;
        const API_HOST = process.env.EXTERNAL_JOBS_API_HOST || "jsearch.p.rapidapi.com";

        const response = await axios.get(`https://${API_HOST}/search`, {
            params: { query: keyword, num_pages: 1 }, // 👈 correct param
            headers: {
                "X-RapidAPI-Key": API_KEY,
                "X-RapidAPI-Host": API_HOST,
            },
        });

        // Normalize data (only what frontend needs)
        const jobs = response.data.data.map((job) => ({
            id: job.job_id,
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city || job.job_country,
            description: job.job_description,
            applyLink: job.job_apply_link,
        }));

        res.status(200).json(jobs);
    } catch (error) {
        console.error("API jobs fetch error:", error.response?.data || error.message);
        res.status(500).json({ message: "Failed to fetch API jobs" });
    }
};


module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobsFromAPI,
};
