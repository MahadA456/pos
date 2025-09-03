"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiService } from "@/services/api"

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [token, setToken] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError("Invalid or missing reset token")
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setSuccess("")

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Both password fields are required")
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!token) {
      setError("Invalid reset token")
      setLoading(false)
      return
    }

    try {
      const response = await apiService.resetPassword(token, formData.newPassword)
      
      if (response.success) {
        setSuccess("Password reset successfully! Redirecting to login...")
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setError(response.error || "Failed to reset password")
      }
    } catch {
      setError("An unexpected error occurred. Please try again.")
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
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

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Back to Login
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-12">
        <div className="max-w-lg text-white text-center">
          <div className="mb-8">
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-white/20 mb-6">
              <span className="text-4xl">🛡️</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Secure Reset</h2>
            <p className="text-xl text-blue-100 mb-8">
              Create a new secure password for your OneStep POS account
            </p>
          </div>

          {/* Password Requirements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Password Requirements:</h3>
            
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-blue-200 rounded-full"></div>
              <span className="text-blue-100 text-sm">At least 6 characters long</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-blue-200 rounded-full"></div>
              <span className="text-blue-100 text-sm">Include uppercase and lowercase letters</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-blue-200 rounded-full"></div>
              <span className="text-blue-100 text-sm">Include at least one number</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-blue-200 rounded-full"></div>
              <span className="text-blue-100 text-sm">Avoid common passwords</span>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-12 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Encrypted Storage</h3>
                <p className="text-blue-100">Your password is securely encrypted</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Secure Tokens</h3>
                <p className="text-blue-100">Reset links expire for security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
