// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-indigo-600 text-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">Job Portal</h1>
      <div className="flex gap-4">
        <Link to="/jobs" className="hover:underline">Jobs</Link>

        {/* Recruiter only → Post Job */}
        {user?.role === "recruiter" && (
          <Link to="/post-job" className="hover:underline">Post Job</Link>
        )}

        {user ? (
          <>
            {/* Candidate → Applications */}
            {user.role === "candidate" && (
              <Link to="/applications" className="hover:underline">
                My Applications
              </Link>
            )}

            {/* Recruiter → Dashboard */}
            {user.role === "recruiter" && (
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            )}

            <button
              onClick={logout}
              className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
