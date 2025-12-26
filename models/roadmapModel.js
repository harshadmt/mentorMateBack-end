const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,

  
  resources: [
    {
      type: { type: String, required: true }, 
      name: { type: String, required: true }  
    }
  ],

  steps: [
  {
    title: String,
    description: String,
    week: Number
  }
],
  isPublished: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
