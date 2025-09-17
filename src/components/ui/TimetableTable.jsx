"use client"
import { useEffect, useState } from "react"
import { getAllTimeTable } from "../../services/operations/timetable"

export default function TimetableTable({ viewType }) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const [timetableData, setTimetableData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllTimeTable()
        if (res?.timetables) {
          let all = [...res.timetables]
          all = all.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )

          setTimetableData(all)
        }
      } catch (err) {
        console.error("Error fetching timetables:", err)
      }
    }
    fetchData()
  }, [])
  
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

  if (!timetableData || timetableData.length === 0) {
    return <div className="p-6 text-gray-600">No timetable available...</div>
  }

  return (
    <div className="space-y-10">
      {timetableData.map((tt) => {
        const slotKeys = extractSlotKeys(tt)

        return (
          <div key={tt._id} className="overflow-x-auto border rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {tt.timetableName} ({tt.academicYear}) - Dept: {tt.department}, Sem {tt.semester}
            </h2>

            <div className="min-w-full">
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
              {slotKeys.map((slotKey) => (
                <div key={slotKey} className="grid grid-cols-8 gap-1 mb-1">
                  <div className="text-sm font-medium text-center p-2 bg-gray-50 rounded flex items-center justify-center text-gray-900">
                    {slotKey.replace("slot", "Slot ")}
                  </div>
                  {days.map((day) => {
                    const schedule = tt.batches[0].schedule.find((d) => d.day === day)
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
        )
      })}
    </div>
  )
}
