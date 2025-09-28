import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const PostJob = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (user?.role !== "recruiter") {
    return (
      <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
        <p className="text-red-600 text-xl">
          Access denied. Only recruiters can post jobs.
        </p>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.company || !form.location || !form.description) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/jobs", form); // Post new job
      setMessage("Job posted successfully!");
      setForm({ title: "", company: "", location: "", description: "" });
      // Optional: redirect to dashboard or jobs page
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-600 mb-6">Post a Job</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 max-w-lg mx-auto flex flex-col gap-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default PostJob;
