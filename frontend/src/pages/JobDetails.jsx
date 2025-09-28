import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth(); // Use AuthContext for user role

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const resJob = await api.get(`/jobs/${id}`);
        setJob(resJob.data);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (!job) return <p className="p-8 text-red-500">Job not found.</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">{job.title}</h1>
        <p className="text-gray-700 mb-1"><strong>Company:</strong> {job.company}</p>
        <p className="text-gray-700 mb-1"><strong>Location:</strong> {job.location}</p>
        <p className="text-gray-700 mb-4"><strong>Posted On:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h2>
        <p className="text-gray-700 mb-4">{job.description}</p>

        <div className="flex gap-3 mt-4">
          {/* Apply Now button for candidate */}
          {user?.role === "candidate" && (
            <Link
              to={`/jobs/${job._id}/apply`}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-center hover:bg-green-700 transition"
            >
              Apply Now
            </Link>
          )}

          <Link
            to="/jobs"
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg text-center hover:bg-gray-700 transition"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
