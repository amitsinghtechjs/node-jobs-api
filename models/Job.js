const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company is required'],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'interview', 'approved'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
