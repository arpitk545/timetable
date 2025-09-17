"use client";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  Building,
  Clock,
  Sparkles,
  Brain,
  Zap,
  X,
} from "lucide-react";
import { Generatetimetable, getAllTimeTable } from "../services/operations/timetable";
import { getAllRoom } from "../services/operations/room";
import { getAllFaculty } from "../services/operations/faculty";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateTimetable() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [existingTimetables, setExistingTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate =useNavigate();
  const [formData, setFormData] = useState({
    timetableName: "",
    existingtimetable: "",
    semester: "",
    department: "",
    academicYear: "",
    classrooms: [],      // will contain room.name strings
    batches: "",         // comma-separated string, normalized on submit
    subjects: [],
    faculty: [],         // will contain fac.name strings
    maxClassesPerDay: "",
    classesPerWeek: "",
    classDuration: "",
    specialSlots: "",
    constraints: "",
  });

  const steps = [
    { id: 1, title: "Basic Information", icon: Calendar },
    { id: 2, title: "Resources", icon: Building },
    { id: 3, title: "Schedule Parameters", icon: Clock },
    { id: 4, title: "Faculty & Constraints", icon: Users },
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const roomsResponse = await getAllRoom();
      if (roomsResponse?.success) {
        setRooms(roomsResponse.data || []);
      }

      const facultyResponse = await getAllFaculty();
      if (facultyResponse?.success) {
        setFaculty(facultyResponse.data || []);
      }

      const timetablesResponse = await getAllTimeTable();
      if (timetablesResponse?.timetables) {
        let allTimetables = [...timetablesResponse.timetables];
        allTimetables = allTimetables.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setExistingTimetables(allTimetables);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load initial data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // flat multiselect change by value (string)
  const handleMultiSelectChange = (field, value, isSelected) => {
    setFormData((prev) => {
      const currentValues = prev[field] || [];
      if (isSelected) {
        if (!currentValues.includes(value)) {
          return { ...prev, [field]: [...currentValues, value] };
        }
        return prev;
      } else {
        return { ...prev, [field]: currentValues.filter((item) => item !== value) };
      }
    });
  };

  const nextStep = () => currentStep < 4 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const normalizeCsv = (s) =>
    String(s || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean); 

  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      const facultyNamesValid = formData.faculty.every((name) =>
        faculty.some((f) => f.name === name)
      );
      const roomNamesValid = formData.classrooms.every((name) =>
        rooms.some((r) => r.name === name)
      );

      if (!facultyNamesValid) {
        toast.error("One or more selected faculty names are invalid.");
        setIsGenerating(false);
        return;
      }
      if (!roomNamesValid) {
        toast.error("One or more selected classrooms are invalid.");
        setIsGenerating(false);
        return;
      }

      const submitData = {
        ...formData,
        classrooms: formData.classrooms, // names array (strings)
        faculty: formData.faculty,       // names array (strings)
        subjects: formData.subjects,     // strings
        batches: Array.isArray(formData.batches)
          ? formData.batches
          : normalizeCsv(formData.batches),
      };

      const response = await Generatetimetable(submitData);

      if (response?.success) {
        toast.success("Timetable generated successfully!");
        navigate("/timetable-view")
      } else {
        toast.error(response?.message || "Failed to generate timetable");
      }
    } catch (error) {
      console.error("Error generating timetable:", error);
      toast.error(error?.message || "Failed to generate timetable");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-auto bg-gradient-to-br from-white via-cyan-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-cyan-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              AI Timetable Generator
            </h1>
            <p className="text-gray-600">Powered by intelligent scheduling algorithms</p>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <div className="px-4 sm:px-6 py-6 bg-gradient-to-r from-cyan-50 to-blue-50">
        <nav className="max-w-5xl mx-auto" aria-label="progress">
          <ol className="flex flex-wrap items-center justify-between gap-3">
            {steps.map((step, index) => {
              const active = currentStep === step.id;
              const done = currentStep > step.id;
              const Icon = step.icon;
              return (
                <li key={step.id} className="flex items-center flex-1 min-w-[180px]">
                  <div
                    className={[
                      "flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base",
                      active
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                        : done
                        ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                        : "bg-white text-gray-600 ring-1 ring-gray-200",
                    ].join(" ")}
                    aria-current={active ? "step" : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold truncate">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-6 w-6 text-gray-400 mx-3 hidden sm:block" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Form Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-cyan-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 sm:px-8 py-5">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Step {currentStep}: {steps[currentStep - 1].title}
              </h2>
              <p className="text-cyan-100 mt-1.5">
                {currentStep === 1 && "Enter basic information about the timetable"}
                {currentStep === 2 && "Define available resources and constraints"}
                {currentStep === 3 && "Set scheduling parameters and preferences"}
                {currentStep === 4 && "Configure faculty details and special constraints"}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Timetable Name</label>
                    <input
                      type="text"
                      placeholder="e.g., CSE Semester 5 - Fall 2024"
                      value={formData.timetableName}
                      onChange={(e) => handleInputChange("timetableName", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Existing Timetables</label>
                    <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-200">
                      <p className="text-cyan-700 font-medium">
                        All existing timetables will be used for reference in generation
                      </p>
                      <p className="text-cyan-600 text-sm mt-1">
                        {existingTimetables.length} timetable(s) available for reference
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Semester</label>
                      <select
                        value={formData.semester}
                        onChange={(e) => handleInputChange("semester", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select semester</option>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleInputChange("department", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select department</option>
                        <option value="cse">Computer Science</option>
                        <option value="ece">Electronics & Communication</option>
                        <option value="me">Mechanical Engineering</option>
                        <option value="ce">Civil Engineering</option>
                        <option value="ee">Electrical Engineering</option>
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Academic Year</label>
                      <input
                        type="text"
                        placeholder="e.g., 2024-2025"
                        value={formData.academicYear}
                        onChange={(e) => handleInputChange("academicYear", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Resources */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Select Classrooms</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                      {rooms.map((room) => (
                        <div key={room._id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`room-${room._id}`}
                            checked={formData.classrooms.includes(room.name)} // store and check by name
                            onChange={(e) =>
                              handleMultiSelectChange("classrooms", room.name, e.target.checked)
                            }
                            className="hidden"
                          />
                          <label
                            htmlFor={`room-${room._id}`}
                            className={`flex-1 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              formData.classrooms.includes(room.name)
                                ? "bg-cyan-100 border-cyan-500 text-cyan-700"
                                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                            } border`}
                          >
                            {room.name} - {room.building} (Cap: {room.capacity})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Batches</label>
                    <input
                      type="text"
                      placeholder="e.g. CSE(AI&ML), CSE(IoT)"
                      value={formData.batches}
                      onChange={(e) => handleInputChange("batches", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Subjects</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.subjects.map((subject, index) => (
                        <div
                          key={`${subject}-${index}`}
                          className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full flex items-center"
                        >
                          {subject}
                          <button
                            type="button"
                            onClick={() => {
                              const newSubjects = [...formData.subjects];
                              newSubjects.splice(index, 1);
                              handleInputChange("subjects", newSubjects);
                            }}
                            className="ml-2 text-cyan-600 hover:text-cyan-800"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a subject and press Enter"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        onKeyDown={(e) => {
                          const v = e.currentTarget.value.trim();
                          if (e.key === "Enter" && v) {
                            e.preventDefault();
                            handleInputChange("subjects", [...formData.subjects, v]);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.querySelector(
                            'input[placeholder="Add a subject and press Enter"]'
                          );
                          const v = input?.value?.trim();
                          if (v) {
                            handleInputChange("subjects", [...formData.subjects, v]);
                            input.value = "";
                          }
                        }}
                        className="px-4 py-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Schedule Parameters */}
              {currentStep === 3 && (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Max Classes Per Day</label>
                    <input
                      type="number"
                      placeholder="e.g., 6"
                      value={formData.maxClassesPerDay}
                      onChange={(e) => handleInputChange("maxClassesPerDay", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Classes Per Week (per subject)</label>
                    <input
                      type="number"
                      placeholder="e.g., 4"
                      value={formData.classesPerWeek}
                      onChange={(e) => handleInputChange("classesPerWeek", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Class Duration (minutes)</label>
                    <select
                      value={formData.classDuration}
                      onChange={(e) => handleInputChange("classDuration", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select duration</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4: Faculty & Constraints */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Select Faculty</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                      {faculty.map((fac) => (
                        <div key={fac._id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`faculty-${fac._id}`}
                            checked={formData.faculty.includes(fac.name)} // name-based
                            onChange={(e) =>
                              handleMultiSelectChange("faculty", fac.name, e.target.checked)
                            }
                            className="hidden"
                          />
                          <label
                            htmlFor={`faculty-${fac._id}`}
                            className={`flex-1 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              formData.faculty.includes(fac.name)
                                ? "bg-cyan-100 border-cyan-500 text-cyan-700"
                                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                            } border`}
                          >
                            {fac.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Special Fixed Slots</label>
                      <input
                        type="text"
                        placeholder="e.g., Lab sessions, Seminars"
                        value={formData.specialSlots}
                        onChange={(e) => handleInputChange("specialSlots", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Additional Constraints</label>
                      <textarea
                        placeholder="Enter any specific requirements, faculty preferences, or constraints..."
                        rows={4}
                        value={formData.constraints}
                        onChange={(e) => handleInputChange("constraints", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-8 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isGenerating}
                    className={[
                      "flex items-center justify-center gap-3 px-8 py-3 rounded-full text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105",
                      isGenerating
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
                    ].join(" ")}
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="h-5 w-5 animate-spin" />
                        <span className="loading-dots">Generating with AI</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Generate Timetable
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
