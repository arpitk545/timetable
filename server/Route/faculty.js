const express =require('express');
const router =express.Router();
const { authenticate } = require("../middlewares/auth");

const {addFaculty,getAllFaculty} =require("../controller/faculty")

router.post("/add-faculty",authenticate,addFaculty);
router.get("/all-faculty-list",getAllFaculty);

module.exports =router;
