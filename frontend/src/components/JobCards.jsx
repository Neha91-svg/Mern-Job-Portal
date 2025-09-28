import React from "react";

const JobCards = ({ job }) => {
    return (
        <div className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.type}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
        </div>
    );
};

export default JobCards; // 👈 default export
