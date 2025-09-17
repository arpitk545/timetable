const bcrypt = require('bcryptjs');
const User = require('../modals/auth');
const jwt = require('jsonwebtoken');

//register
exports.register = async (req, res) => {
  const { fullName, email, password, confirmPassword, role } = req.body;

  // Basic validation
  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Account not found. Please register.",
      });
    }

    // Compare password with hashed one
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Hide password in response
    user.password = undefined;

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    };

    // Send response
    res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//logout 
 exports.logout = async (req, res) => {
    try {
      // Check if the user is already logged in (i.e., token is present in cookies)
      const token = req.cookies.token;
      if (!token) {
        // Return 400 Bad Request status code with error message
        return res.status(400).json({
          success: false,
          message: `User is not logged in`,
        });
      }
  
      // Clear the token cookie to log the user out
      res.clearCookie('token');
      // Return success response
      res.status(200).json({
        success: true,
        message: `User logged out successfully`,
      });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };

