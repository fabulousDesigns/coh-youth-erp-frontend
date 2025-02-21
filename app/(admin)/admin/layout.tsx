"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Library,
  ClipboardCheck,
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-menu")) setIsProfileOpen(false);
      if (!target.closest(".notification-menu")) setIsNotificationOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      description: "Overview and analytics",
    },
    {
      title: "Program Centers",
      href: "/admin/program-centers",
      icon: Users,
      description: "Manage center locations",
    },
    {
      title: "Library",
      href: "/admin/library",
      icon: Library,
      description: "Resource management",
    },
    {
      title: "Volunteers",
      href: "/admin/volunteers",
      icon: Users,
      description: "Volunteers Management",
    },
    {
      title: "Attendance",
      href: "/admin/attendance",
      icon: ClipboardCheck,
      description: "Track volunteer attendance",
    },
  ];

  return (
    <div className="flex min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-secondary-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-secondary-200 px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <CircleDot className="h-5 w-5 text-white" />
            </div>
            <span className="font-sans text-lg font-semibold text-primary-900">
              Admin Portal
            </span>
          </div>

          {/* Search */}
          <div className="px-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Quick search..."
                className="w-full rounded-md border border-secondary-200 bg-white py-2 pl-9 pr-4 text-sm text-secondary-900 placeholder:text-secondary-400
                         focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-primary-50 text-primary-900"
                    : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    pathname === item.href
                      ? "text-primary-600"
                      : "text-secondary-400 group-hover:text-secondary-900"
                  )}
                />
                <div>
                  <div className="font-medium leading-none">{item.title}</div>
                  <div className="mt-1 text-xs text-secondary-500">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-secondary-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="flex h-16 items-center border-b border-secondary-200 bg-white px-4">
          {/* Left side - Mobile menu */}
          <div className="flex-1 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-md p-2 text-secondary-400 hover:bg-secondary-50"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative notification-menu">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="rounded-md p-2 text-secondary-400 hover:bg-secondary-50"
              >
                <Bell className="h-5 w-5" />
              </button>
            </div>

            <div className="relative profile-menu">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-md p-2 text-secondary-900 hover:bg-secondary-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <span className="text-sm font-medium text-primary-600">
                    {auth.getUser()?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {auth.getUser()?.name || "Admin"}
                </span>
                <ChevronDown className="h-4 w-4 text-secondary-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-md border border-secondary-200 bg-white py-1 shadow-lg">
                  <div className="px-4 py-2 text-xs font-medium text-secondary-500">
                    ACCOUNT
                  </div>
                  {/* <a href="#" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                    Your Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50">
                    Settings
                  </a> */}
                  <div className="my-1 h-px bg-secondary-200" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
