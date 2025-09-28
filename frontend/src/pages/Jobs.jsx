import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth(); // Use AuthContext for user role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <p className="p-8 text-gray-500">Loading jobs...</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Explore Jobs</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col hover:shadow-lg transition duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
              <p className="text-gray-600 mb-1">{job.company}</p>
              <p className="text-sm text-gray-500 mb-4">{job.location}</p>
              <p className="text-gray-700 mb-4">
                {job.description.length > 100
                  ? job.description.slice(0, 100) + "..."
                  : job.description}
              </p>

              {/* Apply Now button (Candidate only) */}
              {user?.role === "candidate" && (
                <button
                  onClick={() => navigate(`/jobs/${job._id}/apply`)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Apply Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
