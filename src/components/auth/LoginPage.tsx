"use client"

import type React from "react"

import { useState } from "react"
import { mockUsers, mockStations } from "@/data/mockData"

interface LoginPageProps {
  onLogin: (user: any) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    station: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
    if (!formData.username || !formData.password || !formData.station) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters")
      setLoading(false)
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find user
    const user = mockUsers.find((u) => u.username === formData.username && u.password === formData.password)

    if (!user) {
      setError("Invalid username or password")
      setLoading(false)
      return
    }

    // Check if user is assigned to this station
    const station = mockStations.find((s) => s.id === formData.station)
    if (!station) {
      setError("Invalid station selected")
      setLoading(false)
      return
    }

    // Create session data
    const sessionData = {
      ...user,
      station: station,
      loginTime: new Date().toISOString(),
      rememberMe,
    }

    if (rememberMe) {
      localStorage.setItem(
        "oneStepRememberMe",
        JSON.stringify({
          username: formData.username,
          station: formData.station,
        }),
      )
    }

    onLogin(sessionData)
    setLoading(false)
  }

  // Load remembered credentials
  useState(() => {
    const remembered = localStorage.getItem("oneStepRememberMe")
    if (remembered) {
      const data = JSON.parse(remembered)
      setFormData((prev) => ({
        ...prev,
        username: data.username,
        station: data.station,
      }))
      setRememberMe(true)
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">OneStep POS</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div>
            <label htmlFor="station" className="block text-sm font-medium text-gray-700 mb-2">
              Station
            </label>
            <select
              id="station"
              name="station"
              value={formData.station}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Station</option>
              {mockStations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name} - {station.location}
                </option>
              ))}
            </select>
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
          <div className="text-xs space-y-1">
            <div>
              <strong>Admin:</strong> admin / admin123
            </div>
            <div>
              <strong>Manager:</strong> manager / manager123
            </div>
            <div>
              <strong>Cashier:</strong> cashier / cashier123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
