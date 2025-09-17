// routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const { addRoom, getAllRooms } = require("../controller/room");
const { authenticate } = require("../middlewares/auth");

router.post("/add-room",authenticate,addRoom);
router.get("/all-rooms", getAllRooms);

module.exports = router;
