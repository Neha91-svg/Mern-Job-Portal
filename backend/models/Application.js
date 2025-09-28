const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },    // ✅ Add name
  email: { type: String, required: true },   // ✅ Add email
  resume: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending","reviewed","accepted","rejected"], 
    default: "pending" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
