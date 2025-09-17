const Faculty =require("../modals/faculty")

exports.addFaculty = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      subjects,
      maxleavespermonth,
      preferredSlots,
    } = req.body;

    const userId = req.user.id; 

    // Validation
    if (
      !name || !email || !phone || !department ||
      !subjects || !maxleavespermonth || !preferredSlots
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check for duplicate email
    const existing = await Faculty.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Faculty with this email already exists',
      });
    }

    // Create faculty
    const newFaculty = await Faculty.create({
      name,
      email,
      phone,
      department,
      subjects,
      maxleavespermonth,
      preferredSlots,
      createdBy: userId, 
    });

    res.status(201).json({
      success: true,
      message: 'Faculty added successfully',
      data: newFaculty,
    });
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

//get the faculty list
exports.getAllFaculty = async (req, res) => {
  try {
    const facultyList = await Faculty.find();

    res.status(200).json({
      success: true,
      data: facultyList,
    });
  } catch (error) {
    console.error('Error fetching faculty list:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
