"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  User,
  ChevronDown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileOpen || isNotificationOpen) {
        const target = event.target as HTMLElement;
        if (
          !target.closest(".profile-menu") &&
          !target.closest(".notification-menu")
        ) {
          setIsProfileOpen(false);
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen, isNotificationOpen]);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/volunteer/dashboard",
      icon: LayoutDashboard,
      description: "Overview of your activities",
    },
    {
      title: "Library",
      href: "/volunteer/library",
      icon: Library,
      description: "Access learning resources",
    },
    {
      title: "Attendance",
      href: "/volunteer/attendance",
      icon: ClipboardCheck,
      description: "Track your attendance",
    },
  ];

  return (
    <div className="flex min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 hidden lg:flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          <div className="flex flex-shrink-0 items-center px-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-primary-800">
                Volunteer Portal
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 mt-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-secondary-200 rounded-lg
                         bg-secondary-50 text-secondary-900 placeholder-secondary-400
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition duration-150"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="mt-6 flex-1 flex flex-col">
            <nav className="flex-1 px-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150",
                    pathname === item.href
                      ? "bg-primary-50 text-primary-900"
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-150",
                      pathname === item.href
                        ? "text-primary-600"
                        : "text-secondary-400 group-hover:text-secondary-500"
                    )}
                  />
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-secondary-500">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-shrink-0 border-t border-secondary-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 
                     rounded-lg hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          className="p-4 text-secondary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span className="sr-only">Toggle sidebar</span>
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 flex z-40 lg:hidden",
          isSidebarOpen ? "visible" : "invisible"
        )}
      >
        <div
          className={cn(
            "fixed inset-0 bg-secondary-600 bg-opacity-75 transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside
          className={cn(
            "relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition duration-300",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Mobile sidebar content - same as desktop but with adjusted styling */}
          {/* ... (Similar content as desktop sidebar) ... */}
        </aside>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side */}
              <div className="flex items-center flex-1">
                <button
                  type="button"
                  className="lg:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-500"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative notification-menu">
                  <button
                    className="p-2 text-secondary-400 hover:text-secondary-500 rounded-lg
                             hover:bg-secondary-100 transition duration-150"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <Bell className="h-5 w-5" />
                  </button>

                  {/* Notification dropdown */}
                  {isNotificationOpen && (
                    <div
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 
                                  border border-secondary-200 z-50"
                    >
                      <div className="px-4 py-2 border-b border-secondary-200">
                        <h3 className="text-sm font-medium text-secondary-900">
                          Notifications
                        </h3>
                      </div>
                      {/* Add notification items here */}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative profile-menu">
                  <button
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 
                             transition duration-150"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="hidden md:flex items-center">
                      <span className="text-sm font-medium text-secondary-700">
                        John Doe
                      </span>
                      <ChevronDown className="w-4 h-4 ml-1 text-secondary-400" />
                    </div>
                  </button>

                  {/* Profile dropdown menu */}
                  {isProfileOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 
                                  border border-secondary-200 z-50"
                    >
                      <a
                        href="#profile"
                        className="block px-4 py-2 text-sm text-secondary-700 
                                                  hover:bg-secondary-50"
                      >
                        Your Profile
                      </a>
                      <a
                        href="#settings"
                        className="block px-4 py-2 text-sm text-secondary-700 
                                                   hover:bg-secondary-50"
                      >
                        Settings
                      </a>
                      <div className="border-t border-secondary-200" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 
                                 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
