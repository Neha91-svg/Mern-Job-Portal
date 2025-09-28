import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
import ApplyPage from "./pages/ApplyPage";
import JobDetails from "./pages/JobDetails";
import JobApplicants from "./pages/JobApplicants";
import ProtectedRoute from "./components/protectedRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="app-container">
        <Routes>
          {/* Default */}
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Jobs list / explore */}
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            } 
          />

          {/* Candidate: Apply for a job */}
          <Route
            path="/jobs/:id/apply"
            element={
              <ProtectedRoute roles={["candidate"]}>
                <ApplyPage />
              </ProtectedRoute>
            }
          />

          {/* Job details page */}
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            }
          />

          {/* Recruiter: Post a job */}
          <Route
            path="/post-job"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <PostJob />
              </ProtectedRoute>
            }
          />

          {/* Candidate: My applications */}
          <Route
            path="/applications"
            element={
              <ProtectedRoute roles={["candidate"]}>
                <Applications />
              </ProtectedRoute>
            }
          />

          {/* Recruiter: View applicants for a job */}
          <Route
            path="/job/:jobId/applicants"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <JobApplicants />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/jobs" replace />} />
        </Routes>
      </div>
    </>
  );
}
