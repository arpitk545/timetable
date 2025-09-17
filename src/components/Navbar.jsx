"use client";
import { useState, useEffect } from "react";
import { Menu, X, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Features", to: "#features" },
    { name: "Contact", to: "#contact" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleOnboarding = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rounded, glass container */}
        <div className="relative mt-3 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-sm">
          <div className="flex items-center h-14 px-4">
            {/* Left: Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Edu Smart
              </span>
            </div>

            {/* Center: Nav links (desktop) */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 hidden md:flex items-center">
              <div className="flex items-center gap-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="text-gray-700 hover:text-cyan-600 transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Auth actions (desktop) */}
            <div className="ml-auto hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <button
                  onClick={handleOnboarding}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-full transition-colors"
                >
                  Onboarding Page
                </button>
              ) : (
                <>
                  <Link to="/login">
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-full transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-full transition-colors">
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: menu toggle */}
            <div className="ml-auto md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-200 px-4 py-3">
              <div className="flex flex-col gap-3">
                <div className="flex justify-center gap-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.to}
                      className="text-gray-700 hover:text-cyan-600 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="flex gap-2">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        handleOnboarding();
                        setIsOpen(false);
                      }}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full transition-colors"
                    >
                      Onboarding Page
                    </button>
                  ) : (
                    <>
                      <Link to="/login" className="flex-1">
                        <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-full transition-colors">
                          Login
                        </button>
                      </Link>
                      <Link to="/register" className="flex-1">
                        <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full transition-colors">
                          Get Started
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
