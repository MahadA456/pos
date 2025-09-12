"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authManager } from "@/utils/auth"
import { User } from "@/utils/auth"

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing JWT session
    if (authManager.isAuthenticated() && !authManager.isTokenExpired()) {
      const user = authManager.getCurrentUser()
      if (user) {
        setCurrentUser(user)
        // Redirect to dashboard if authenticated
        router.push("/dashboard")
        return
      }
    } else {
      // Clear expired session
      authManager.logout()
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // If user is authenticated, redirect to dashboard
  if (currentUser) {
    return null // Will redirect to dashboard
  }

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-blue-600 mb-8 shadow-lg">
              <span className="text-4xl text-white">🏪</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              OneStep <span className="text-blue-600">POS</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The complete point-of-sale solution for modern businesses. 
              Streamline your operations with our powerful and intuitive system.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl mb-4">💳</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Transactions</h3>
              <p className="text-gray-600">Process sales quickly and efficiently with our intuitive interface.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Reports</h3>
              <p className="text-gray-600">Get instant insights into your business performance and sales data.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">Enterprise-grade security with role-based access control.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Account
            </button>
          </div>

          {/* Footer */}
          <div className="mt-16 text-gray-500 text-sm">
            <p>&copy; 2025 OneStep POS. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
