const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const database =require("./config/database")
const authRoutes =require("./Route/auth");
const facultyRoutes =require("./Route/faculty")
const roomRoutes =require("./Route/room");
const timetableRoutes =require("./Route/timetable")
// Load env variables
dotenv.config();
database.connect();
const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://timetable-beryl-ten.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
// Routes
app.get('/', (req, res) => {
  res.send('Backend is running...');
});
app.use("/api/v1",authRoutes);
app.use("/api/v1",facultyRoutes);
app.use("/api/v1",roomRoutes);
app.use("/api/v1",timetableRoutes);

// Server Listen
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
