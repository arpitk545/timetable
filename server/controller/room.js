const Room = require("../modals/room");

exports.addRoom = async (req, res) => {
  try {
    const {
      name,
      building,
      floor,
      capacity,
      type,
      facilities,
    } = req.body;

    const userId = req.user.id; 

    // Basic validation
    if (!name || !building || !floor || !capacity || !type) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if room with same name already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "A room with this name already exists",
      });
    }

    // Create new room
    const newRoom = await Room.create({
      name,
      building,
      floor,
      capacity,
      type,
      facilities: facilities || [],
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Room added successfully",
      data: newRoom,
    });

  } catch (error) {
    console.error("Error adding room:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding room",
      error: error.message,
    });
  }
};

//get all rooms 
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("createdBy", "fullName email");

    return res.status(200).json({
      success: true,
      message: "All rooms fetched successfully",
      data: rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching rooms",
      error: error.message,
    });
  }
};
