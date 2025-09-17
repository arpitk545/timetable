"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Building, MapPin, Users, Monitor, Wifi, Volume2, Loader2, X } from "lucide-react"
import { addRoom, getAllRoom } from "../services/operations/room"
import { toast } from "react-hot-toast"

export default function RoomsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [addLoading, setAddLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [currentFacility, setCurrentFacility] = useState("")

  const [newRoom, setNewRoom] = useState({
    name: "",
    building: "",
    floor: "",
    capacity: "",
    type: "",
    facilities: [],
  })
  useEffect(() => {
    fetchRoomsData()
  }, [])

  const fetchRoomsData = async () => {
    try {
      setLoading(true)
      const response = await getAllRoom()
      if (response.success) {
        const roomsWithAvailability = response.data.map(room => ({
          ...room,
          availability: Math.random() > 0.3 ? "Available" : "Available"
        }))
        setRooms(roomsWithAvailability)
      } else {
        toast.error("Failed to fetch rooms data")
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      toast.error(error.message || "Failed to fetch rooms data")
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddFacility = () => {
    if (currentFacility.trim()) {
      setNewRoom({
        ...newRoom,
        facilities: [...newRoom.facilities, currentFacility.trim()]
      })
      setCurrentFacility("")
    }
  }

  const handleRemoveFacility = (index) => {
    const updatedFacilities = [...newRoom.facilities]
    updatedFacilities.splice(index, 1)
    setNewRoom({
      ...newRoom,
      facilities: updatedFacilities
    })
  }

  const resetForm = () => {
    setNewRoom({
      name: "",
      building: "",
      floor: "",
      capacity: "",
      type: "",
      facilities: [],
    })
    setCurrentFacility("")
  }

  const handleAddRoom = async () => {
    try {
      setAddLoading(true)
      const response = await addRoom(newRoom)
      
      if (response.success) {
        toast.success("Room added successfully")
        setRooms([...rooms, {...response.data, availability: "Available"}])
        setShowAddModal(false)
        resetForm()
      } else {
        toast.error(response.message || "Failed to add room")
      }
    } catch (error) {
      console.error("Error adding room:", error)
      toast.error(error.message || "Failed to add room")
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditRoom = (room) => {
    setEditingRoom(room)
    setNewRoom({
      name: room.name,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      type: room.type,
      facilities: [...room.facilities],
    })
    setShowAddModal(true)
  }

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return
    }

    try {
      setDeleteLoading(id)
      // Add your delete API call here when implemented
      // await deleteRoom(id)
      setRooms(rooms.filter((room) => room._id !== id))
      toast.success("Room deleted successfully")
    } catch (error) {
      console.error("Error deleting room:", error)
      toast.error(error.message || "Failed to delete room")
    } finally {
      setDeleteLoading(null)
    }
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingRoom(null)
    resetForm()
  }

  const getFacilityIcon = (facility) => {
    if (facility.toLowerCase().includes("projector") || facility.toLowerCase().includes("computer")) return Monitor
    if (facility.toLowerCase().includes("audio") || facility.toLowerCase().includes("sound")) return Volume2
    if (facility.toLowerCase().includes("wifi")) return Wifi
    return Building
  }

  return (
    <div className="fixed inset-0 overflow-auto bg-gradient-to-br from-white via-cyan-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-cyan-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Rooms Management
              </h1>
              <p className="text-gray-600">Manage classrooms, labs, and facilities</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            Add Room
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
                placeholder="Search rooms by name, building, or type..."
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
            /* Rooms Grid */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div
                  key={room._id || room.id}
                  className="bg-white rounded-2xl shadow-lg border border-cyan-100 overflow-hidden card-hover"
                >
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">{room.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          room.availability === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {room.availability}
                      </span>
                    </div>
                    <p className="text-cyan-100">{room.type}</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Building className="h-4 w-4" />
                      <span className="text-sm">{room.building}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{room.floor}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">Capacity: {room.capacity} students</span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-semibold text-gray-700">Facilities:</span>
                      <div className="flex flex-wrap gap-2">
                        {room.facilities.map((facility, index) => {
                          const IconComponent = getFacilityIcon(facility)
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium"
                            >
                              <IconComponent className="h-3 w-3" />
                              {facility}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button 
                        onClick={() => handleEditRoom(room)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room._id || room.id)}
                        disabled={deleteLoading === (room._id || room.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 disabled:bg-red-300"
                      >
                        {deleteLoading === (room._id || room.id) ? (
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

      {/* Add/Edit Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">
                {editingRoom ? "Edit Room" : "Add New Room"}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Room Name *</label>
                  <input
                    type="text"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Room A-101"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Building *</label>
                  <input
                    type="text"
                    value={newRoom.building}
                    onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Academic Block A"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Floor *</label>
                  <select
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select floor</option>
                    <option value="Ground Floor">Ground Floor</option>
                    <option value="First Floor">First Floor</option>
                    <option value="Second Floor">Second Floor</option>
                    <option value="Third Floor">Third Floor</option>
                    <option value="Fourth Floor">Fourth Floor</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Capacity *</label>
                  <input
                    type="number"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter capacity"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Room Type *</label>
                  <select
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select room type</option>
                    <option value="Classroom">Classroom</option>
                    <option value="Lecture Hall">Lecture Hall</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Science Lab">Science Lab</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Seminar Room">Seminar Room</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Facilities</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentFacility}
                      onChange={(e) => setCurrentFacility(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFacility()}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter facility and press Add"
                    />
                    <button
                      onClick={handleAddFacility}
                      className="px-4 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newRoom.facilities.map((facility, index) => {
                      const IconComponent = getFacilityIcon(facility)
                      return (
                        <span
                          key={index}
                          className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <IconComponent className="h-3 w-3" />
                          {facility}
                          <button
                            onClick={() => handleRemoveFacility(index)}
                            className="text-cyan-800 hover:text-cyan-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )
                    })}
                  </div>
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
                  onClick={handleAddRoom}
                  disabled={addLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {editingRoom ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingRoom ? "Update Room" : "Add Room"
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