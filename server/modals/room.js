// models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    building: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    facilities: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema);
