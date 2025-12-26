const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  allowStudentAccess: {
    type: Boolean,
    default: true,
  },
  allowMentorAccess: {
    type: Boolean,
    default: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  }
}, { timestamps: true });

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
