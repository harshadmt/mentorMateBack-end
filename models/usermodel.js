const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "mentor", "admin"], required: true },
  bio: { type: String },
  profilePicture: { type: String },
  skills: { type: [String], default: [] },
  unlockedRoadmaps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' }],
  createdRoadmaps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' }],
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);