"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, User, Mail, Phone, BookOpen, Calendar, Loader2, X } from "lucide-react"
import { addFaculty, getAllFaculty } from "../services/operations/faculty"
import toast from "react-hot-toast"

export default function FacultyManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState(null)
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [addLoading, setAddLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [currentSubject, setCurrentSubject] = useState("")

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    subjects: [],
    maxleavespermonth: "",
    preferredSlots: [],
  })
  
  useEffect(() => {
    fetchFacultyData()
  }, [])

  const fetchFacultyData = async () => {
    try {
      setLoading(true)
      const response = await getAllFaculty()
      if (response.success) {
        setFaculty(response.data)
      } else {
        toast.error("Failed to fetch faculty data")
      }
    } catch (error) {
      console.error("Error fetching faculty:", error)
      toast.error(error.message || "Failed to fetch faculty data")
    } finally {
      setLoading(false)
    }
  }

  const filteredFaculty = faculty.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.subjects.some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddSubject = () => {
    if (currentSubject.trim()) {
      setNewFaculty({
        ...newFaculty,
        subjects: [...newFaculty.subjects, currentSubject.trim()]
      })
      setCurrentSubject("")
    }
  }

  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...newFaculty.subjects]
    updatedSubjects.splice(index, 1)
    setNewFaculty({
      ...newFaculty,
      subjects: updatedSubjects
    })
  }

  const handleSlotChange = (slot) => {
    if (newFaculty.preferredSlots.includes(slot)) {
      setNewFaculty({
        ...newFaculty,
        preferredSlots: newFaculty.preferredSlots.filter(s => s !== slot)
      })
    } else {
      setNewFaculty({
        ...newFaculty,
        preferredSlots: [...newFaculty.preferredSlots, slot]
      })
    }
  }

  const resetForm = () => {
    setNewFaculty({
      name: "",
      email: "",
      phone: "",
      department: "",
      subjects: [],
      maxleavespermonth: "",
      preferredSlots: [],
    })
    setCurrentSubject("")
  }

  const handleAddFaculty = async () => {
    try {
      setAddLoading(true)
      const response = await addFaculty(newFaculty)
      
      if (response.success) {
        toast.success("Faculty added successfully")
        setFaculty([...faculty, response.data])
        setShowAddModal(false)
        resetForm()
      } else {
        toast.error(response.message || "Failed to add faculty")
      }
    } catch (error) {
      console.error("Error adding faculty:", error)
      toast.error(error.message || "Failed to add faculty")
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditFaculty = (faculty) => {
    setEditingFaculty(faculty)
    setNewFaculty({
      name: faculty.name,
      email: faculty.email,
      phone: faculty.phone,
      department: faculty.department,
      subjects: [...faculty.subjects],
      maxleavespermonth: faculty.maxleavespermonth,
      preferredSlots: [...faculty.preferredSlots],
    })
    setShowAddModal(true)
  }

  const handleDeleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) {
      return
    }

    try {
      setDeleteLoading(id)
      // Add your delete API call here when implemented
      // await deleteFaculty(id)
      setFaculty(faculty.filter((member) => member.id !== id))
      toast.success("Faculty deleted successfully")
    } catch (error) {
      console.error("Error deleting faculty:", error)
      toast.error(error.message || "Failed to delete faculty")
    } finally {
      setDeleteLoading(null)
    }
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingFaculty(null)
    resetForm()
  }

  return (
    <div className="fixed inset-0 overflow-auto bg-gradient-to-br from-white via-cyan-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-cyan-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Faculty Management
              </h1>
              <p className="text-gray-600">Manage faculty members and their preferences</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Add Faculty
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search faculty by name, department, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            </div>
          ) : (
            /* Faculty Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFaculty.map((member) => (
                <div
                  key={member._id || member.id}
                  className="bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden card-hover"
                >
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-cyan-100">{member.department}</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{member.email}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{member.phone}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm font-semibold">Subjects:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Max {member.maxleavespermonth} Leaves/Month</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-gray-700">Preferred Slots:</span>
                      <div className="flex flex-wrap gap-2">
                        {member.preferredSlots.map((slot, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button 
                        onClick={() => handleEditFaculty(member)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFaculty(member._id || member.id)}
                        disabled={deleteLoading === (member._id || member.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 disabled:bg-red-300"
                      >
                        {deleteLoading === (member._id || member.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Faculty Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">
                {editingFaculty ? "Edit Faculty Member" : "Add New Faculty Member"}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    value={newFaculty.name}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={newFaculty.email}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    value={newFaculty.phone}
                    onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Department *</label>
                  <select
                    value={newFaculty.department}
                    onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Subjects *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentSubject}
                      onChange={(e) => setCurrentSubject(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter subject and press Add"
                    />
                    <button
                      onClick={handleAddSubject}
                      className="px-4 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newFaculty.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium flex items-center gap-1"
                      >
                        {subject}
                        <button
                          onClick={() => handleRemoveSubject(index)}
                          className="text-cyan-800 hover:text-cyan-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Preferred Slots *</label>
                  <div className="flex flex-wrap gap-3">
                    {["Morning", "Afternoon", "Evening"].map((slot) => (
                      <label key={slot} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newFaculty.preferredSlots.includes(slot)}
                          onChange={() => handleSlotChange(slot)}
                          className="rounded text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Max Leaves Per Month *</label>
                  <input
                    type="number"
                    value={newFaculty.maxleavespermonth}
                    onChange={(e) => setNewFaculty({ ...newFaculty, maxleavespermonth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter leaves per Month"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFaculty}
                  disabled={addLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {editingFaculty ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingFaculty ? "Update Faculty" : "Add Faculty"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}