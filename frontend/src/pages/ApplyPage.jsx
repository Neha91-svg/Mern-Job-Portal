import React, { useState } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";

const ApplyPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState("");
  const [message, setMessage] = useState(""); // For success/error messages
  const [loading, setLoading] = useState(false);

  // Handle name/email input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResume(file);

    // Preview logic
    if (file.type === "application/pdf") {
      setResumePreview(URL.createObjectURL(file));
    } else {
      setResumePreview(file.name); // DOC/DOCX just show filename
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      setMessage("Please select a resume to apply.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("resume", resume);

    try {
      setLoading(true);
      setMessage(""); // clear previous messages
      await api.post(`/applications/apply/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Application submitted successfully!");
      setFormData({ name: "", email: "" });
      setResume(null);
      setResumePreview("");

      // auto-clear message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to apply. Try again.");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">Apply for Job</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 max-w-lg mx-auto flex flex-col gap-4"
        encType="multipart/form-data"
      >
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            required
          />
        </div>

        {/* Resume upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            required
          />
        </div>

        {/* Preview */}
        {resumePreview && (
          <div className="mt-2 p-2 border rounded bg-gray-50">
            {resumePreview.endsWith(".pdf") || resumePreview.startsWith("blob:") ? (
              <iframe
                src={resumePreview}
                title="Resume Preview"
                width="100%"
                height="300px"
                className="border rounded"
              />
            ) : (
              <p className="text-gray-700">Selected file: {resumePreview}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>

        {/* Inline Message */}
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ApplyPage;
