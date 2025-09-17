"use client"

import { useState } from "react"
import Sidebar from "../components/ui/sidebar"
import TimetableTable from "../components/ui/TimetableTable"
import { Download, Filter, Calendar, Users, Building } from "lucide-react"

export default function TimetableView() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState("Computer Science")
  const [selectedSemester, setSelectedSemester] = useState("5")
  const [activeTab, setActiveTab] = useState("batch")

  const handleExport = (format) => {
    console.log(`Exporting timetable as ${format}`)
  }

  return (
    <div className="flex inset-0 fixed overflow-auto bg-white">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Timetable Viewer</h1>
              <p className="text-gray-600">View and manage generated timetables</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExport("pdf")}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Filters:</span>
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
            </select>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Sem {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <main className="p-6">
          <div className="space-y-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("batch")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "batch"
                      ? "border-cyan-500 text-cyan-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  View by Batch
                </button>
                <button
                  onClick={() => setActiveTab("faculty")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "faculty"
                      ? "border-cyan-500 text-cyan-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  View by Faculty
                </button>
                <button
                  onClick={() => setActiveTab("room")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === "room"
                      ? "border-cyan-500 text-cyan-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Building className="h-4 w-4" />
                  View by Room
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab === "batch" && `Batch Timetable - ${selectedDepartment} Sem ${selectedSemester}`}
                  {activeTab === "faculty" && "Faculty Schedule"}
                  {activeTab === "room" && "Room Utilization"}
                </h3>
              </div>
              <div className="p-6">
                <TimetableTable
                  viewType={activeTab}
                  department={selectedDepartment}
                  semester={selectedSemester}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
