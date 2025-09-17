// Sidebar.jsx
import React, { useEffect, useMemo, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { FiUsers, FiCalendar, FiFileText, FiCheckSquare, FiBox } from "react-icons/fi"; 
import { SidebarClose, SidebarOpen } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Menu with Home above Dashboard
  const menuItems = useMemo(
    () => [
      { id: "home", label: "Home", icon: FiHome, to: "/", color: "text-cyan-600" },
      { id: "dashboard", label: "Dashboard", icon: FiBox, to: "/dashboard", color: "text-sky-600" },
      { id: "create", label: "Create Timetable", icon: FiCalendar, to: "/create-timetable", color: "text-emerald-600" },
      { id: "view", label: "View Timetables", icon: FiFileText, to: "/timetable-view", color: "text-indigo-600" },
      { id: "approval", label: "Approvals", icon: FiCheckSquare, to: "/approval", color: "text-amber-600" },
      { id: "faculty", label: "Faculty", icon: FiUsers, to: "/faculty", color: "text-pink-600" },
      { id: "rooms", label: "Rooms", icon: FiBox, to: "/rooms", color: "text-violet-600" },
    ],
    []
  ); // uses react-icons Fi set [2]

  // Determine active by path; fallback to Home
  const activeItem = useMemo(() => {
    const found = menuItems.find((m) =>
      m.to === "/" ? location.pathname === "/" : location.pathname.startsWith(m.to)
    );
    return found || menuItems;
  }, [location.pathname, menuItems]); // route-aware active selection [12]

  // Collapsed: clicking active icon expands and keeps route (if not on it, navigate first)
  const handleCollapsedIconClick = useCallback(() => {
    if (
      !(activeItem.to === "/" ? location.pathname === "/" : location.pathname.startsWith(activeItem.to))
    ) {
      navigate(activeItem.to);
    }
    setIsOpen(true);
  }, [activeItem.to, location.pathname, navigate, setIsOpen]);

  // Auto-close on mobile after route change
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    if (mq.matches) setIsOpen(false);
  }, [location.pathname, setIsOpen]); 

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-white via-cyan-50 to-white border-r border-gray-200 z-50 flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-16"}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        aria-label="Sidebar"
      >
        {/* Header: larger title when expanded; collapsed shows only active icon */}
        <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
          {isOpen ? (
            <div className="flex justify-between ">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
                aria-label="Collapse sidebar"
                title="Collapse"
              >
                <SidebarOpen className="h-5 w-5 text-gray-700" />
              </button>
              <div className="w-9" aria-hidden="true" />
            </div>
          ) : (
            <button
              onClick={handleCollapsedIconClick}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
              aria-label="Expand sidebar"
              title={activeItem.label}
            >
              {/* Only the active item icon is visible in collapsed */}
              <SidebarClose className={`h-5 w-5 ${activeItem.color}`} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors",
                    isActive ? "bg-cyan-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")
                }
                end={item.to === "/"}
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full">
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : item.color}`} />
                    {isOpen && (
                      <span className={`truncate ${isActive ? "font-bold" : "font-semibold"}`}>
                        {item.label}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer: Settings above Sign out, sticky bottom */}
        <div className="p-3 border-t border-gray-200 sticky bottom-0 bg-white">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              [
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors mb-2",
                isActive ? "bg-cyan-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100",
              ].join(" ")
            }
            end
          >
            {({ isActive }) => (
              <div className="flex items-center gap-3 w-full">
                <FiSettings className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-700"}`} />
                {isOpen && <span className={`${isActive ? "font-bold" : "font-semibold"}`}>Settings</span>}
              </div>
            )}
          </NavLink>

          <button
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => {
              navigate("/logout")
            }}
          >
            <FiLogOut className="h-5 w-5 text-rose-600" />
            {isOpen && <span className="font-bold">Sign out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
