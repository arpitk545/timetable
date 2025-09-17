const express = require("express");
const router = express.Router();
const { generateTimetableWithAI,getAllTimetables } = require("../controller/timetable");
const { authenticate } = require("../middlewares/auth");

router.post("/generate-ai",authenticate,generateTimetableWithAI);
router.get("/get-all-timetable",getAllTimetables)

module.exports = router;
