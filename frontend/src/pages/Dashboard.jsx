import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [manualJobs, setManualJobs] = useState([]); // recruiter added jobs
  const [apiJobs, setApiJobs] = useState([]);       // external API jobs
  const [applicantsMap, setApplicantsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [expandedJobs, setExpandedJobs] = useState({});

  const fetchManualJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setManualJobs(res.data || []);
    } catch (err) {
      console.error("Manual jobs fetch error:", err);
      setError("Failed to load manual jobs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchApiJobs = async (keyword) => {
    if (!keyword.trim()) return;
    try {
      setLoading(true);
      const res = await api.get(`/jobs/api-jobs?keyword=${keyword}`);
      setApiJobs(res.data || []);
    } catch (err) {
      console.error("API jobs fetch error:", err);
      setError("Failed to load API jobs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecruiterJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs/my-jobs");
      const recruiterJobs = res.data || [];

      const applicants = {};
      await Promise.all(
        recruiterJobs.map(async (job) => {
          try {
            const apps = await api.get(`/applications/job/${job._id}`);
            applicants[job._id] = apps.data || [];
          } catch {
            applicants[job._id] = [];
          }
        })
      );

      setManualJobs(recruiterJobs);
      setApplicantsMap(applicants);
    } catch (err) {
      console.error("Recruiter jobs fetch error:", err);
      setError("Failed to load recruiter jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role === "candidate") fetchManualJobs();
    if (user.role === "recruiter") fetchRecruiterJobs();
  }, [user]);

  const updateStatus = async (appId, jobId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplicantsMap((prev) => ({
        ...prev,
        [jobId]: prev[jobId].map((app) =>
          app._id === appId ? { ...app, status } : app
        ),
      }));
      setStatusMessage(`Status updated to "${status}"`);
      setTimeout(() => setStatusMessage(""), 3000);
    } catch {
      setStatusMessage("Failed to update status.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Welcome, {user?.name}
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {statusMessage && (
        <p className="mb-4 text-center text-sm text-white bg-indigo-600 p-2 rounded">
          {statusMessage}
        </p>
      )}

      {/* Candidate → Search Bar */}
      {user.role === "candidate" && (
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Search jobs from API..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-1/2"
          />
          <button
            onClick={() => fetchApiJobs(searchKeyword)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      )}

      {/* Candidate → Manual Jobs */}
      {user.role === "candidate" && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Jobs from our Portal
          </h2>
          {manualJobs.length === 0 ? (
            <p className="text-gray-500 mb-6">No manual jobs available.</p>
          ) : (
            <div className="space-y-4 mb-8">
              {manualJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Candidate → API Jobs */}
      {user.role === "candidate" && apiJobs.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Jobs from External API
          </h2>
          <div className="space-y-4">
            {apiJobs.map((job, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {job.title}
                </h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
                {job.applyLink && (
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Apply Now
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Recruiter → Jobs + Applicants */}
      {user.role === "recruiter" && (
        <div className="space-y-6">
          {manualJobs.map((job) => {
            const jobId = job._id;
            return (
              <div
                key={jobId}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-600 mb-1">{job.company}</p>
                <p className="text-sm text-gray-500 mb-3">{job.location}</p>

                <button
                  onClick={() =>
                    setExpandedJobs((prev) => ({
                      ...prev,
                      [jobId]: !prev[jobId],
                    }))
                  }
                  className="mb-2 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                >
                  {expandedJobs[jobId] ? "Hide Applicants" : "Show Applicants"}
                </button>

                {expandedJobs[jobId] && applicantsMap[jobId]?.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {applicantsMap[jobId].map((app) => (
                      <div
                        key={app._id}
                        className="border rounded-lg p-3 flex flex-col md:flex-row justify-between items-start md:items-center"
                      >
                        <div>
                          {/* ✅ Use app.name / app.email first */}
                          <p className="font-medium">
                            {app.name || app.candidate?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {app.email || app.candidate?.email}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-semibold mt-1 ${
                              statusColors[app.status || "pending"]
                            }`}
                          >
                            {app.status
                              ? app.status.charAt(0).toUpperCase() +
                                app.status.slice(1)
                              : "Pending"}
                          </span>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 mt-3 md:mt-0">
                          {app.resume ? (
                            <a
                              href={
                                app.resume.startsWith("http")
                                  ? app.resume
                                  : `http://localhost:5000${app.resume}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                            >
                              View Resume
                            </a>
                          ) : (
                            <p className="text-red-500">No resume uploaded</p>
                          )}

                          <button
                            onClick={() =>
                              updateStatus(app._id, job._id, "accepted")
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(app._id, job._id, "rejected")
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(app._id, job._id, "pending")
                            }
                            className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
                          >
                            Pending
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
