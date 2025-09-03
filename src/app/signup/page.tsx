"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiService, SignupRequest } from "@/services/api"

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupRequest>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CASHIER",
    assignedStationIds: [],
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await apiService.signup(formData)
      if (response.success) {
        setSuccess("Account created! Redirecting to login...")
        setTimeout(() => router.push("/login"), 1500)
      } else {
        setError(response.error || "Signup failed")
      }
    } catch {
      setError("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-600 mb-4">
              <span className="text-2xl text-white">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Join OneStep POS</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                required
              >
                <option value="">Select a role</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="STORE_MANAGER">Store Manager</option>
                <option value="CASHIER">Cashier</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Links */}
          <div className="text-center space-y-3">
            <button
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Already have an account? Sign in
            </button>
            <div>
              <button
                onClick={() => router.push("/")}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="max-w-lg text-white text-center">
          <div className="mb-8">
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-white/20 mb-6">
              <span className="text-4xl">🏪</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Welcome to OneStep POS</h2>
            <p className="text-xl text-blue-100 mb-8">
              The complete point-of-sale solution for modern businesses
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Easy Transactions</h3>
                <p className="text-blue-100">Process sales quickly and efficiently</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Real-time Reports</h3>
                <p className="text-blue-100">Get instant insights into your business</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Secure & Reliable</h3>
                <p className="text-blue-100">Enterprise-grade security with role-based access</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Lightning Fast</h3>
                <p className="text-blue-100">Optimized for speed and performance</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-blue-100 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-blue-100 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-100 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
