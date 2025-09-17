const { GeneratedTimetable } = require('../modals/timetable');
const Faculty = require('../modals/faculty');
const Room = require('../modals/room');
const genAI = require('../config/gemini');
const User =require("../modals/auth");
const generateTimetableWithAI = async (req, res) => {
  try {
    const {
      timetableName,
      existingtimetable,
      semester,
      department,
      academicYear,
      batches,
      classrooms: classroomNames,
      faculty: facultyNames,
      subjects,
      maxClassesPerDay,
      classesPerWeek,
      classDuration,
      constraints,
      specialSlots,
    } = req.body;
     const userId = req.user.id;

    if (
      !timetableName ||
      !semester ||
      !department ||
      !academicYear ||
      !batches ||
      !subjects ||
      !classroomNames ||
      classroomNames.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields or empty classrooms" });
    }

    // Lookup Faculty and Rooms
    const facultyDocs = await Faculty.find({ name: { $in: facultyNames } });
    if (facultyDocs.length !== facultyNames.length) {
      return res.status(404).json({ message: "One or more faculty not found" });
    }

    const roomDocs = await Room.find({ name: { $in: classroomNames } });
    if (roomDocs.length !== classroomNames.length) {
      return res.status(404).json({ message: "One or more classrooms not found" });
    }

    // Fetch all approved existing timetables (same dept, year, semester)
    const existingTimetables = await GeneratedTimetable.find({
      academicYear,
      semester,
      department,
      status: "approved"
    }).lean();

    // Format existing timetable info for the AI
    const existingTimetableStr = existingTimetables.map(tt => {
      return `Timetable Name: ${tt.timetableName}
Semester: ${tt.semester}
Department: ${tt.department}
Academic Year: ${tt.academicYear}
Status: ${tt.status}
Batches:
${tt.batches.map(b => {
  return `- Batch: ${b.batch}
  Schedule:
${b.schedule.map(day => {
    return `    ${day.day}:
${Object.entries(day.slots).map(([slot, info]) => {
      return `      ${slot}: ${info.subject} by ${info.faculty} in ${info.room}`;
    }).join("\n")}`;
  }).join("\n")}`;
}).join("\n\n")}
`;
    }).join("\n\n---\n\n");

    // Prepare faculty info
    const facultyInfoStr = facultyDocs
      .map(f => {
        return `Name: ${f.name}, Subjects: ${f.subjects.join(", ")}, Preferred Slots: ${f.preferredSlots?.join(", ") || "None"}`;
      }).join("\n");

    const roomsInfoStr = roomDocs
      .map(r => {
        return `Name: ${r.name}, Type: ${r.type}, Capacity: ${r.capacity}, Building: ${r.building}`;
      }).join("\n");

// Prompt for Gemini
const prompt = `
You are tasked with generating a weekly academic timetable using the provided data.

---

### 📘 New Timetable Details (from request body):
- Timetable Name: ${timetableName}
-existing timetable:${existingtimetable}
- Department: ${department}
- Semester: ${semester}
- Academic Year: ${academicYear}
- Batches: ${batches.join(", ")}
- Subjects: ${subjects.join(", ")}
- Faculty: ${facultyNames.join(", ")}
- Classrooms: ${classroomNames.join(", ")}
- Max Classes Per Day: ${maxClassesPerDay}
- Classes Per Week: ${classesPerWeek}
- Class Duration: ${classDuration} minutes
- Constraints: ${constraints || "None"}
- Special Slots: ${specialSlots || "None"}

---

### 🏫 Faculty Information:
${facultyInfoStr}

---

### 🏫 Available Classrooms:
${roomsInfoStr}

---

### 🛑 EXTREMELY IMPORTANT — EXISTING TIMETABLE CONFLICT AVOIDANCE

From the request body, you're also given a field called \`existingtimetable\` — this includes **all previously stored and approved timetables** in the database.

🔴 **You MUST check every faculty and room assignment in the \`existingtimetable\`.**
- Do NOT assign a faculty member to more than one class at the same time.
- Do NOT assign the same room to two different batches at the same time.
- DO NOT make assumptions — strictly avoid any day-time combination already used by any faculty or room in \`existingtimetable\`.

You must treat this data as immutable and authoritative — if a faculty or room is already scheduled in a particular day/time, you must choose a different one.

${existingTimetableStr || "No existing approved timetables."}

---

### ✅ Schedule Requirements (MUST FOLLOW EXACTLY):

1. The schedule must cover **all days from Monday to Saturday** for each batch.
2. For each day, assign classes starting from **10:00 AM**, with each class lasting exactly \`${classDuration}\` minutes.
3. The number of classes per day must not exceed \`${maxClassesPerDay}\`.
4. The total number of classes scheduled per batch in the week must be exactly \`${classesPerWeek}\`.
5. For any time slots with no class (due to clash or scheduling constraints), fill the slot with empty values:
   \`{ "subject": "", "faculty": "", "room": "" }\`
6. Time slots should be represented as keys with time strings, for example:
   \`"10:00", "10:45", "11:30"\` etc., incremented by the class duration.

---

### ✅ Output Format (MUST FOLLOW EXACTLY):

Return **only JSON**, matching this structure exactly:

\`\`\`json
{
  "batches": [
    {
      "batch": "CSE5A",
      "schedule": [
        {
          "day": "Monday",
          "slots": {
            "10:00": { "subject": "OS", "faculty": "Dr. Anjali Mehta", "room": "Room A-101" },
            "10:45": { "subject": "DBMS", "faculty": "Arpit Kumar", "room": "Lab B-205" },
            ...
          }
        },
        {
          "day": "Tuesday",
          "slots": {
            "10:00": { "subject": "", "faculty": "", "room": "" },
            "10:45": { "subject": "CN", "faculty": "Dr. Sharma", "room": "Room C-301" },
            ...
          }
        },
        ...
      ]
    },
    ...
  ]
}
\`\`\`

---

### ⚠️ Rules You Must Follow:

1. Include **all batches** in the output.
2. Each batch must have a complete \`schedule\` array with entries for Monday through Saturday.
3. The number of classes per day must not exceed \`${maxClassesPerDay}\`.
4. Total classes per week must be exactly \`${classesPerWeek}\`.
5. No faculty or room conflicts allowed — cross-check with \`existingtimetable\`.
6. Use only the provided faculty and rooms.
7. Shuffle faculty and room assignments where possible.
8. Distribute classes evenly through the week and faculty.
9. Output only valid JSON — no extra text, markdown, or comments.

---
`;

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const textResponse = (await result.response).text();

    let parsedData;
    try {
      const cleaned = textResponse.replace(/```json\n?|```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    } catch (parseError) {
      return res.status(500).json({
        message: "Failed to parse AI response",
        error: parseError.message,
        rawResponse: textResponse
      });
    }
    if (!parsedData || !Array.isArray(parsedData.batches)) {
  return res.status(400).json({
    message: "Invalid AI response format: 'batches' field is missing or not an array",
    rawResponse: parsedData
  });
}
    // Basic clash checker
const clashMap = {};

for (const batch of parsedData.batches) {
  if (!Array.isArray(batch.schedule)) {
    return res.status(400).json({
      message: `Invalid or missing schedule for batch: ${batch.batch}`
    });
  }

  for (const day of batch.schedule) {
    if (!day || typeof day !== 'object' || !day.slots) continue;

    for (const [slotKey, slotValue] of Object.entries(day.slots)) {
      // Skip empty or incomplete slots
      if (
        !slotValue ||
        !slotValue.subject ||
        !slotValue.faculty ||
        !slotValue.room
      ) {
        continue; // Don't check or store clashes for incomplete slots
      }

      const keyFaculty = `${day.day}-${slotKey}-${slotValue.faculty}`;
      const keyRoom = `${day.day}-${slotKey}-${slotValue.room}`;

      if (clashMap[keyFaculty]) {
        return res.status(400).json({
          message: `Faculty clash detected: ${slotValue.faculty} already assigned at ${day.day} ${slotKey}`
        });
      }

      if (clashMap[keyRoom]) {
        return res.status(400).json({
          message: `Room clash detected: ${slotValue.room} already assigned at ${day.day} ${slotKey}`
        });
      }

      clashMap[keyFaculty] = true;
      clashMap[keyRoom] = true;
    }
  }
}


    // Save to DB
    const generatedTimetable = new GeneratedTimetable({
      timetableName,
      semester,
      department,
      academicYear,
      batches: parsedData.batches,
      status: "approved",
      createdBy: userId
    });

    await generatedTimetable.save();

    return res.status(201).json({
      message: "Timetable generated successfully",
      timetable: generatedTimetable
    });

  } catch (error) {
    console.error("Error generating timetable:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


//Generated the timetable
const getAllTimetables = async (req, res) => {
  try {
    const timetables = await GeneratedTimetable.find();

    res.status(200).json({
      message: 'All timetables retrieved successfully',
      timetables: timetables,
    });
  } catch (error) {
    console.error('Error fetching timetables:', error);
    res.status(500).json({ message: 'Server error while fetching timetables' });
  }
};

module.exports = {
  generateTimetableWithAI,
  getAllTimetables,
};
