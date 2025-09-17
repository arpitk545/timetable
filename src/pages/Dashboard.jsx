"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/ui/sidebar"
import { Calendar, Users, Building, Clock, Plus, TrendingUp, AlertCircle } from "lucide-react"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const stats = [
    {
      title: "Timetables Created",
      value: "24",
      change: "+12%",
      icon: Calendar,
      color: "text-cyan-600",
    },
    {
      title: "Faculty Registered",
      value: "156",
      change: "+8%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Classrooms Managed",
      value: "48",
      change: "+4%",
      icon: Building,
      color: "text-indigo-600",
    },
    {
      title: "Active Sessions",
      value: "312",
      change: "+16%",
      icon: Clock,
      color: "text-cyan-600",
    },
  ]

  const recentActivity = [
    { action: "New timetable created for Computer Science Dept.", time: "2 hours ago", type: "success" },
    { action: "Faculty availability updated for Dr. Smith", time: "4 hours ago", type: "info" },
    { action: "Classroom conflict resolved in Block A", time: "6 hours ago", type: "warning" },
    { action: "Weekly schedule approved by Dean", time: "1 day ago", type: "success" },
  ]

  return (
    <div className="flex fixed inset-0 overflow-auto bg-gradient-to-br from-white via-cyan-50 to-white">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                <span 
                  onClick={() => navigate("/create-timetable")} 
                  className="text-cyan-600 cursor-pointer hover:underline"
                >
                  Create Timetable
                </span>{" "}
                / rest all same
              </p>
            </div>
            <button
              onClick={() => navigate("/create-timetable")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Timetable
            </button>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-gray-600">Latest updates and changes in your system</p>
              </div>
              <div className="p-6 space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`p-1 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "warning"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <AlertCircle className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <p className="text-gray-600">Common tasks and shortcuts</p>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/create-timetable")}
                  className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="h-6 w-6 text-gray-600" />
                  <span className="text-sm text-gray-900">New Timetable</span>
                </button>
                <button
                  onClick={() => navigate("/faculty")}
                  className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-6 w-6 text-gray-600" />
                  <span className="text-sm text-gray-900">Manage Faculty</span>
                </button>
                <button
                  onClick={() => navigate("/rooms")}
                  className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Building className="h-6 w-6 text-gray-600" />
                  <span className="text-sm text-gray-900">Room Setup</span>
                </button>
                <button
                  onClick={() => navigate("/timetable-view")}
                  className="h-20 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Clock className="h-6 w-6 text-gray-600" />
                  <span className="text-sm text-gray-900">View Schedules</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
