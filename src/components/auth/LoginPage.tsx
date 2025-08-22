"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { apiService, SigninRequest } from "@/services/api"
import { authManager } from "@/utils/auth"
import SignupPage from "./SignupPage"

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  status: string;
  assignedStations: unknown[];
  station?: {
    id: string;
    name: string;
    location: string;
    status: string;
    ipAddress: string;
    printerName: string;
    cashDrawer: string;
  };
  loginTime?: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState<SigninRequest>({
    username: "",
    password: "",
    stationId: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation
    if (!formData.username || !formData.password) {
      setError("Username and password are required")
      setLoading(false)
      return
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters")
      setLoading(false)
      return
    }

    try {
      const response = await apiService.signin(formData)

      if (response.success && response.data) {
        // Save authentication data
        authManager.setAuth(response.data)
        
        // Call the onLogin callback with the user data
        onLogin(response.data.user)
      } else {
        setError(response.error || "Invalid username or password")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }

    if (rememberMe) {
      localStorage.setItem(
        "oneStepRememberMe",
        JSON.stringify({
          username: formData.username,
        }),
      )
    }
  }

  // Load remembered credentials
  useEffect(() => {
    const remembered = localStorage.getItem("oneStepRememberMe")
    if (remembered) {
      const data = JSON.parse(remembered)
      setFormData((prev) => ({
        ...prev,
        username: data.username,
      }))
      setRememberMe(true)
    }
  }, [])

  if (showSignup) {
    return (
      <SignupPage 
        onSwitchToLogin={() => setShowSignup(false)}
        onSignupSuccess={() => {
          // After successful signup, get the user and call onLogin
          const user = authManager.getCurrentUser();
          if (user) {
            onLogin(user);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            <span className="text-2xl text-white">🏪</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OneStep POS</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl shadow-sm">{error}</div>}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => setShowSignup(true)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
            >
              Don&apos;t have an account? Sign up
            </button>
            <div>
              <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                Forgot your password?
              </a>
            </div>
          </div>
        </form>

        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
          <p className="text-xs text-gray-700 mb-2 font-medium">Demo Credentials:</p>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-purple-700">Admin:</span>
              <span className="text-gray-600">admin / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-purple-700">Manager:</span>
              <span className="text-gray-600">manager / manager123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-purple-700">Cashier:</span>
              <span className="text-gray-600">cashier / cashier123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
