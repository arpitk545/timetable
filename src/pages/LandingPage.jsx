"use client"

import { useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Calendar, Users, Clock, ArrowRight, BookOpen, Settings, CheckCircle } from "lucide-react"

export default function LandingPage() {
  useEffect(() => {
    // Initialize smooth scrolling
    const initSmoothScroll = () => {
      const links = document.querySelectorAll('a[href^="#"]')
      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault()
          const target = document.querySelector(link.getAttribute("href"))
          if (target) {
            target.scrollIntoView({ behavior: "smooth" })
          }
        })
      })
    }

    initSmoothScroll()
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="fixed inset-0 overflow-auto bg-gradient-to-b from-white to-cyan-50">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Smarter Scheduling for <span className="text-cyan-600">Smarter University</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your institution's timetable management with AI-powered scheduling that eliminates conflicts and
              maximizes resource utilization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection("features")}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-lg px-6 py-4 rounded-full flex items-center justify-center gap-2 group transition-colors"
              >
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-6 py-4 rounded-full transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of academic scheduling with our intelligent features designed for modern educational
              institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-200 transition-colors">
                <Calendar className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">AI-Powered Scheduling</h3>
              <p className="text-gray-600">
                Advanced algorithms optimize your timetables automatically, considering all constraints and preferences
                to create conflict-free schedules.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Faculty-Friendly Interface</h3>
              <p className="text-gray-600">
                Intuitive design that makes it easy for administrators and faculty to input preferences, view schedules,
                and make adjustments.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">No Clashes, No Chaos</h3>
              <p className="text-gray-600">
                Eliminate scheduling conflicts with intelligent conflict detection and resolution, ensuring smooth
                operations across all departments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Streamline Your Academic Operations</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our Smart Timetable Generator addresses the complex challenges of modern educational scheduling, from
                NEP 2020 compliance to multi-departmental coordination.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Maximize Resource Utilization</h4>
                    <p className="text-gray-600">
                      Optimize classroom and laboratory usage while balancing faculty workloads effectively.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Multi-Department Support</h4>
                    <p className="text-gray-600">
                      Handle complex interdisciplinary courses and shared resources across multiple departments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Settings className="h-6 w-6 text-cyan-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">Flexible Configuration</h4>
                    <p className="text-gray-600">
                      Customize parameters for your institution's unique requirements and constraints.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-cyan-600">95%</div>
                    <div className="text-sm text-gray-600">Conflict Reduction</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">80%</div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">100%</div>
                    <div className="text-sm text-gray-600">Faculty Satisfaction</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-cyan-600">24/7</div>
                    <div className="text-sm text-gray-600">System Availability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Scheduling?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of educational institutions already using our platform to create better timetables.
          </p>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white text-lg px-4 py-2 rounded-full transition-colors">
            Start Free Trial
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}