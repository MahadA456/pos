"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiService } from "@/services/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (!email) {
      setError("Email is required")
      setLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const response = await apiService.forgotPassword(email)
      
      if (response.success) {
        setSuccess("Password reset instructions have been sent to your email address.")
      } else {
        setError(response.error || "Failed to send reset email")
      }
    } catch (err) {
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
              <span className="text-2xl text-white">🔑</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password</p>
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter your email address"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending reset email...
                </div>
              ) : (
                "Send Reset Email"
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
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Password Recovery</h2>
            <p className="text-xl text-blue-100 mb-8">
              We'll help you get back into your OneStep POS account
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Email Recovery</h3>
                <p className="text-blue-100">Secure password reset via email</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Quick Process</h3>
                <p className="text-blue-100">Reset your password in minutes</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Secure & Safe</h3>
                <p className="text-blue-100">Enterprise-grade security</p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 p-6 bg-white/10 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm">
              If you don't receive the email within a few minutes, check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
