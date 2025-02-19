"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  Loader2,
  ChevronLeft,
  Shield,
  Users2,
  ClipboardCheck,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
    };

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.push("/admin/volunteers");
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left side - Feature Showcase */}
      <div
        className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 
                    relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-white space-y-8 max-w-lg">
            <h2 className="text-4xl font-bold font-sans">
              Join Our Volunteer Network
            </h2>
            <p className="text-lg opacity-90 font-sans leading-relaxed">
              Be part of something bigger. Join our community of dedicated
              volunteers and make a difference in people's lives.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center
                             backdrop-blur-sm"
                >
                  <Users2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Community</h3>
                  <p className="text-sm opacity-80">
                    Join a network of dedicated volunteers
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center
                             backdrop-blur-sm"
                >
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Activities</h3>
                  <p className="text-sm opacity-80">
                    Participate in meaningful projects
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center
                             backdrop-blur-sm"
                >
                  <BadgeCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Recognition</h3>
                  <p className="text-sm opacity-80">
                    Get acknowledged for your contribution
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center
                             backdrop-blur-sm"
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Security</h3>
                  <p className="text-sm opacity-80">
                    Your data is safe with us
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div
                className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 
                           rounded-2xl flex items-center justify-center shadow-lg"
              >
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-primary-800 font-sans">
              Create New Volunteer
            </h1>
            <p className="text-secondary-600 font-sans">
              Add a new volunteer to the system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="p-4 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100 
                           flex items-center animate-shake"
              >
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 flex items-center">
                  <User className="w-4 h-4 mr-2 text-primary-600" />
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="block w-full px-4 py-3 border border-secondary-200 rounded-lg
                             bg-white/50 backdrop-blur-sm shadow-sm
                             placeholder-secondary-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 
                             focus:border-transparent transition duration-200
                             group-hover:border-primary-400"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary-600" />
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full px-4 py-3 border border-secondary-200 rounded-lg
                             bg-white/50 backdrop-blur-sm shadow-sm
                             placeholder-secondary-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 
                             focus:border-transparent transition duration-200
                             group-hover:border-primary-400"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary-600" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full px-4 py-3 border border-secondary-200 rounded-lg
                             bg-white/50 backdrop-blur-sm shadow-sm
                             placeholder-secondary-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 
                             focus:border-transparent transition duration-200
                             group-hover:border-primary-400"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary-600" />
                  Phone Number
                </label>
                <div className="relative group">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="block w-full px-4 py-3 border border-secondary-200 rounded-lg
                             bg-white/50 backdrop-blur-sm shadow-sm
                             placeholder-secondary-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 
                             focus:border-transparent transition duration-200
                             group-hover:border-primary-400"
                    placeholder="Enter phone number (optional)"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 
                       text-white rounded-lg shadow-lg hover:shadow-xl 
                       transition duration-200 flex items-center justify-center
                       hover:translate-y-[-1px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating volunteer...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Volunteer Account
                </>
              )}
            </Button>

            <div className="flex justify-center">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 
                         transition duration-200 group"
              >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
