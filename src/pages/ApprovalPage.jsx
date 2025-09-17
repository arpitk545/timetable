"use client"
import { useState, useEffect } from "react"
import Sidebar from "../components/ui/sidebar"
import { CheckCircle, XCircle, Clock, Calendar, User, X } from "lucide-react"
import { getAllTimeTable } from "../services/operations/timetable"

export default function ApprovalPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedTimetable, setSelectedTimetable] = useState(null)
  const [timetableData, setTimetableData] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [viewType, setViewType] = useState("batch")

  // Function to calculate utilization percentage
  const calculateUtilization = (timetable) => {
    if (!timetable?.batches?.[0]?.schedule) return "0%";
    
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let totalSlots = 0;
    let occupiedSlots = 0;
    
    // Calculate total and occupied slots
    timetable.batches[0].schedule.forEach(daySchedule => {
      if (days.includes(daySchedule.day)) {
        Object.keys(daySchedule.slots || {}).forEach(slotKey => {
          totalSlots++;
          const slot = daySchedule.slots[slotKey];
          if (slot && slot.subject && !slot.subject.toLowerCase().includes("lunch")) {
            occupiedSlots++;
          }
        });
      }
    });
    
    // Avoid division by zero
    if (totalSlots === 0) return "0%";
    
    // Calculate percentage
    const utilization = (occupiedSlots / totalSlots) * 100;
    return `${Math.round(utilization)}%`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllTimeTable()
        if (res?.timetables) {
          let all = [...res.timetables]
          all = all.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )

          // Add hardcoded conflicts (0) and calculated utilization
          const enhancedTimetables = all.map(tt => ({
            ...tt,
            conflicts: 0, // Hardcoded to 0 as requested
            utilization: calculateUtilization(tt),
            status: tt.status || "pending" // Default status
          }))
          
          setTimetableData(enhancedTimetables)
        }
      } catch (err) {
        console.error("Error fetching timetables:", err)
      }
    }
    fetchData()
  }, [])

  const handleApprove = (id) => {
    // Update the status of the timetable to approved
    setTimetableData(prevData => 
      prevData.map(tt => 
        tt._id === id ? {...tt, status: "approved"} : tt
      )
    );
    
    if (selectedTimetable && selectedTimetable._id === id) {
      setSelectedTimetable({...selectedTimetable, status: "approved"});
    }
    
    console.log(`Approving timetable ${id}`)
  }

  const handleReject = (id) => {
    // Update the status of the timetable to rejected
    setTimetableData(prevData => 
      prevData.map(tt => 
        tt._id === id ? {...tt, status: "rejected"} : tt
      )
    );
    
    if (selectedTimetable && selectedTimetable._id === id) {
      setSelectedTimetable({...selectedTimetable, status: "rejected"});
    }
    
    console.log(`Rejecting timetable ${id}`)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        )
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        )
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>
    }
  }

  // Timetable Modal Component
  const TimetableModal = ({ timetable, onClose, viewType, setViewType }) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    
    const extractSlotKeys = (timetable) => {
      if (!timetable?.batches?.[0]?.schedule?.[0]?.slots) return []
      return Object.keys(timetable.batches[0].schedule[0].slots)
    }

    const getCellContent = (slots, slotKey) => {
      const slot = slots[slotKey]
      if (!slot || !slot.subject) return null

      if (slot.subject.toLowerCase().includes("lunch")) {
        return <div className="text-center text-gray-600 font-medium">Lunch Break</div>
      }

      if (viewType === "batch") {
        return (
          <div className="p-2 bg-cyan-50 rounded border-l-4 border-cyan-500">
            <div className="font-semibold text-sm text-gray-900">{slot.subject}</div>
            <div className="text-xs text-gray-600">{slot.faculty}</div>
            <div className="text-xs text-gray-600">{slot.room}</div>
          </div>
        )
      }
      if (viewType === "faculty") {
        return (
          <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-500">
            <div className="text-sm text-gray-900">{slot.faculty}</div>
            <div className="text-xs text-gray-600">{slot.room}</div>
          </div>
        )
      }
      if (viewType === "room") {
        return (
          <div className="p-2 bg-green-50 rounded border-l-4 border-green-500">
            <div className="text-sm text-gray-900">{slot.room}</div>
          </div>
        )
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">
              {timetable.timetableName} ({timetable.academicYear}) - Dept: {timetable.department}, Sem {timetable.semester}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4 flex gap-2">
              <button 
                onClick={() => setViewType("batch")} 
                className={`px-3 py-1 rounded ${viewType === "batch" ? "bg-cyan-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                Batch View
              </button>
              <button 
                onClick={() => setViewType("faculty")} 
                className={`px-3 py-1 rounded ${viewType === "faculty" ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                Faculty View
              </button>
              <button 
                onClick={() => setViewType("room")} 
                className={`px-3 py-1 rounded ${viewType === "room" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                Room View
              </button>
            </div>
            
            <div className="overflow-x-auto">
              {/* Header row */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="font-semibold text-center p-2 bg-gray-100 rounded text-gray-900">Time</div>
                {days.map((day) => (
                  <div key={day} className="font-semibold text-center p-2 bg-gray-100 rounded text-gray-900">
                    {day}
                  </div>
                ))}
              </div>

              {/* Timetable grid */}
              {extractSlotKeys(timetable).map((slotKey) => (
                <div key={slotKey} className="grid grid-cols-8 gap-1 mb-1">
                  <div className="text-sm font-medium text-center p-2 bg-gray-50 rounded flex items-center justify-center text-gray-900">
                    {slotKey.replace("slot", "Slot ")}
                  </div>
                  {days.map((day) => {
                    const schedule = timetable.batches[0].schedule.find((d) => d.day === day)
                    return (
                      <div key={`${day}-${slotKey}`} className="min-h-[80px] border border-gray-200 rounded p-1">
                        {schedule ? getCellContent(schedule.slots, slotKey) : null}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex fixed inset-0 overflow-auto bg-gradient-to-br from-white via-cyan-50 to-white">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Timetable Approvals</h1>
            <p className="text-gray-600">Review and approve generated timetables</p>
          </div>
        </header>

        <main className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Pending Approvals</h2>
          
          {/* Timetable List in 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {timetableData.map((timetable) => (
              <div
                key={timetable._id}
                className={`bg-white border border-gray-200 rounded-lg transition-all hover:shadow-md ${
                  selectedTimetable?._id === timetable._id ? "ring-2 ring-cyan-500" : ""
                }`}
              >
                <div className="p-6 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{timetable.timetableName}</h3>
                      <p className="flex items-center gap-2 mt-1 text-gray-600">
                        <User className="h-4 w-4" />
                        Created by {timetable.createdBy || "Unknown"}
                      </p>
                    </div>
                    {getStatusBadge(timetable.status)}
                  </div>
                </div>
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <p className="font-medium text-gray-900">{timetable.department}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <p className="font-medium text-gray-900">
                        {new Date(timetable.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Conflicts:</span>
                      <p className="font-medium text-green-600">
                        0
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Utilization:</span>
                      <p className="font-medium text-gray-900">{timetable.utilization}</p>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons for each card */}
                <div className="px-6 pb-6 flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setSelectedTimetable(timetable);
                      setModalOpen(true);
                    }}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    View Timetable
                  </button>
                  
                  <div className="flex gap-3">
                    {timetable.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(timetable._id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(timetable._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </>
                    )}
                    
                    {timetable.status === "approved" && (
                      <button
                        onClick={() => handleReject(timetable._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    )}
                    
                    {timetable.status === "rejected" && (
                      <button
                        onClick={() => handleApprove(timetable._id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Single Modal for Timetable View */}
      {modalOpen && selectedTimetable && (
        <TimetableModal 
          timetable={selectedTimetable} 
          onClose={() => setModalOpen(false)} 
          viewType={viewType}
          setViewType={setViewType}
        />
      )}
    </div>
  )
}