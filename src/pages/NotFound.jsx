import { Calendar, Home, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">SmartSchedule</span>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-cyan-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for seems to have been moved or doesn't exist. Let's get you back on track
            with your timetable management.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Support */}
        <div className="mt-8 text-sm text-gray-600">
          <p>Need help? Contact our support team at</p>
          <a href="mailto:support@smartschedule.edu" className="text-cyan-600 hover:text-cyan-700 font-medium">
            support@smartschedule.edu
          </a>
        </div>
      </div>
    </div>
  )
}
