import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!user) return;
        const res = await api.get("/applications/my-applications");
        setApplications(res.data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to fetch applications. Please try again later.");
      }
    };

    fetchApplications();
  }, [user]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-6">My Applications</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {applications.length === 0 ? (
        <p className="text-gray-500">You haven’t applied to any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {app.job.title}
                  </h2>
                  <p className="text-gray-600">{app.job.company}</p>
                  <p className="text-sm text-gray-500">{app.job.location}</p>
                  <p className="text-gray-700 mt-2">{app.job.description}</p>
                </div>

                {/* Status badge */}
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-sm ${
                    statusColors[app.status || "pending"]
                  }`}
                >
                  {app.status
                    ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                    : "Pending"}
                </span>
              </div>

              {/* Resume link */}
              {app.resume && (
                <a
                  href={`http://localhost:5000${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-3 block"
                >
                  View / Download Resume
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
