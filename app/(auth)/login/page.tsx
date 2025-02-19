"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogIn,
  Mail,
  Lock,
  Loader2,
  ChevronRight,
  Database,
  BarChart3,
  Users2,
  Settings2,
  Clock,
  Shield,
  Github,
  Chrome,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { auth } from "@/lib/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      auth.setAuth(data);
      router.refresh();

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/volunteer/dashboard");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div
                className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 
                           rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Database className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-primary-800 font-sans">
              Welcome Back
            </h1>
            <p className="text-secondary-600 font-sans">
              Enter your credentials to access your account
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
                    placeholder="name@company.com"
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
                    autoComplete="current-password"
                    required
                    className="block w-full px-4 py-3 border border-secondary-200 rounded-lg
                             bg-white/50 backdrop-blur-sm shadow-sm
                             placeholder-secondary-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 
                             focus:border-transparent transition duration-200
                             group-hover:border-primary-400"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-secondary-300 rounded text-primary-600 
                           focus:ring-primary-500 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-secondary-600"
                >
                  Remember me
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 
                         focus:outline-none focus:underline transition duration-200
                         flex items-center group"
              >
                Forgot password?
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
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
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign in to your account
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-secondary-500 font-mono">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center px-4 py-2 border border-secondary-200 
                           rounded-lg shadow-sm hover:shadow-md transition duration-200
                           hover:bg-secondary-50 group"
            >
              <Chrome className="w-5 h-5 mr-2 text-secondary-600 group-hover:text-primary-600" />
              <span className="text-secondary-600 group-hover:text-primary-600">
                Google
              </span>
            </button>
            <button
              className="flex items-center justify-center px-4 py-2 border border-secondary-200 
                           rounded-lg shadow-sm hover:shadow-md transition duration-200
                           hover:bg-secondary-50 group"
            >
              <Github className="w-5 h-5 mr-2 text-secondary-600 group-hover:text-primary-600" />
              <span className="text-secondary-600 group-hover:text-primary-600">
                GitHub
              </span>
            </button>
          </div>

          <p className="text-center text-sm text-secondary-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500 
                       focus:outline-none focus:underline transition duration-200
                       inline-flex items-center group"
            >
              Create an account
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Feature Showcase */}
      <div
        className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 
                    relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-white space-y-8 max-w-lg">
            <h2 className="text-4xl font-bold font-sans">
              COH youth Enterprise Resource Planning System
            </h2>
            <p className="text-lg opacity-90 font-sans leading-relaxed">COH</p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center
                             backdrop-blur-sm"
                >
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Analytics</h3>
                  <p className="text-sm opacity-80">Get to know our Program</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center
                             backdrop-blur-sm"
                >
                  <Users2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Volunteers</h3>
                  <p className="text-sm opacity-80">Become a volunteer Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
