// App.js
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import CreateTimetable from "./pages/CreateTimeTable";
import TimetableView from "./pages/TimeTableView";
import ApprovalPage from "./pages/ApprovalPage";
import FacultyManagement from "./pages/FacultyManagement";
import RoomsManagement from "./pages/RoomManagement";
import NotFound from "./pages/NotFound";
import Logout from "./pages/logout";
import "./App.css";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-timetable" element={<CreateTimetable />} />
        <Route path="/timetable-view" element={<TimetableView />} />
        <Route path="/approval" element={<ApprovalPage />} />
        <Route path="/faculty" element={<FacultyManagement />} />
        <Route path="/rooms" element={<RoomsManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
