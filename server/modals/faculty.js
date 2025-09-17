const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  subjects: {
    type: [String],
    default: [],
  },
  maxleavespermonth: {
    type: Number,
    required: true,
  },
  preferredSlots: {
    type: [String],
    enum: ['Morning', 'Afternoon', 'Evening'],
    default: [],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
