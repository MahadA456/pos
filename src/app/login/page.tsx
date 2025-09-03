"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiService, SigninRequest } from "@/services/api"
import { authManager } from "@/utils/auth"

export default function LoginPage() {
  const [formData, setFormData] = useState<SigninRequest>({
    username: "",
    password: "",
    stationId: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        
        // Redirect to dashboard
        router.push("/")
      } else {
        setError(response.error || "Invalid username or password")
      }
    } catch {
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

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-600 mb-4">
              <span className="text-2xl text-white">🏪</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">OneStep POS</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Don&apos;t have an account? Sign up
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          </form>

          <div className="text-center">
            <button
              onClick={() => router.push("/")}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="max-w-lg text-white text-center">
          <div className="mb-8">
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-white/20 mb-6">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
            <p className="text-xl text-blue-100 mb-8">
              Sign in to access your OneStep POS dashboard
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Dashboard Access</h3>
                <p className="text-blue-100">View real-time sales and analytics</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Process Transactions</h3>
                <p className="text-blue-100">Handle sales and payments efficiently</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">User Management</h3>
                <p className="text-blue-100">Manage staff and permissions</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">System Settings</h3>
                <p className="text-blue-100">Configure your POS system</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-100 text-sm">Access</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">🔒</div>
              <div className="text-blue-100 text-sm">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">⚡</div>
              <div className="text-blue-100 text-sm">Fast</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
