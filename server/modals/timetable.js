const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema(
  {
    timetableName: {
      type: String,
      required: true,
      trim: true,
    },
    existingtimetable:{
      type:String,
    },
    semester: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    classrooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room", 
        required: true,
      },
    ],
    batches: [
      {
        type: String, 
        required: true,
      },
    ],
    subjects: [
      {
        type: String, 
        required: true,
      },
    ],
    faculty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Schedule rules
    maxClassesPerDay: {
      type: Number,
      default: 5,
    },
    classesPerWeek: {
      type: Number,
      default: 30,
    },
    classDuration: {
      type: String,
      default: "60 min",
    },
    specialSlots: {
      type: String, 
    },
    constraints: {
      type: String, 
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Timetable = mongoose.model("Timetable", timetableSchema);


const timetableEntrySchema = new mongoose.Schema(
  {
    subject: { type: String, },
    faculty: { type: String, },
    room: { type: String,},
  },
  { _id: false }
);

// One day's schedule (e.g., Monday)
const dailyScheduleSchema = new mongoose.Schema(
  {
    day: { type: String, required: true }, 
    slots: {
      type: Map,
      of: timetableEntrySchema, 
      //required: true,
    },
  },
  { _id: false }
);

// Schedule for one batch (entire week)
const batchScheduleSchema = new mongoose.Schema(
  {
    batch: { type: String, required: true }, 
    schedule: [dailyScheduleSchema],
  },
  { _id: false }
);

// Complete structured timetable
const generatedTimetableSchema = new mongoose.Schema(
  {
    timetableName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      //required: true,
    },
    batches: [batchScheduleSchema],
    status: {
      type: String,
      enum: ["pending", "approved", "draft"],
      default: "approved",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      //required: true,
    },
  },
  { timestamps: true }
);

const GeneratedTimetable = mongoose.model("GeneratedTimetable", generatedTimetableSchema);

module.exports = {
  Timetable,
  GeneratedTimetable,
};
