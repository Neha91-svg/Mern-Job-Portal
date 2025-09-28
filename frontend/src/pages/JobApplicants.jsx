import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [statusMessage, setStatusMessage] = useState(""); // message state

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await api.get(`/applications/job/${jobId}`);
        setApplications(res.data || []);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setApplications([]);
        setStatusMessage("Failed to load applicants."); // show error
      }
    };
    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status } : app))
      );
      setStatusMessage(`Status updated to "${status}" successfully.`); // success message
      setTimeout(() => setStatusMessage(""), 3000); // clear after 3s
    } catch (err) {
      setStatusMessage("Failed to update status.");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        Applicants for this Job
      </h1>

      {/* Inline status message */}
      {statusMessage && (
        <p className="mb-4 text-center text-sm text-white bg-indigo-600 p-2 rounded">
          {statusMessage}
        </p>
      )}

      {applications.length === 0 ? (
        <p className="text-gray-500">No applicants yet.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition flex flex-col md:flex-row justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  {app.candidate?.name || "No Name"}
                </h2>
                <p className="text-gray-600 mb-1">{app.candidate?.email || "No Email"}</p>

                {/* Resume link */}
                {app.resume ? (
                  <a
                    href={app.resume.startsWith("http") ? app.resume : `http://localhost:5000${app.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    View Resume
                  </a>
                ) : (
                  <p className="text-red-500 mt-2">No resume uploaded</p>
                )}
              </div>

              <div className="flex flex-col items-start mt-4 md:mt-0 md:items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-sm ${
                    statusColors[app.status || "pending"]
                  }`}
                >
                  {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "Pending"}
                </span>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateStatus(app._id, "accepted")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "pending")}
                    className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Pending
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
