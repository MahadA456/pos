"use client"

import { useState, useEffect } from "react"
import { apiService, LoginHistory as LoginHistoryType } from "@/services/api"
import { authManager } from "@/utils/auth"

export default function LoginHistory() {
  const user = authManager.getCurrentUser()
  const [loginHistory, setLoginHistory] = useState<LoginHistoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")

  useEffect(() => {
    loadLoginHistory()
  }, [])

  const loadLoginHistory = async () => {
    try {
      setLoading(true)
      const response = await apiService.getLoginHistory()
      console.log('📊 Login History Response:', response)
      
      if (response.success && response.data) {
        console.log('📋 Login History Data:', response.data)
        console.log('🔍 First entry status:', response.data[0]?.status)
        setLoginHistory(response.data)
      } else {
        console.warn('⚠️ API failed, using mock data')
        // Fallback to mock data if API fails
        const mockData: LoginHistoryType[] = [
          {
            id: "1",
            userId: "user1",
            username: "admin",
            loginTime: new Date().toISOString(),
            ipAddress: "192.168.1.100",
            status: "active",
            stationName: "Station 1"
          },
          {
            id: "2", 
            userId: "user2",
            username: "cashier",
            loginTime: new Date(Date.now() - 3600000).toISOString(),
            logoutTime: new Date().toISOString(),
            ipAddress: "192.168.1.101",
            status: "completed",
            sessionDuration: 3600,
            stationName: "Station 2"
          }
        ]
        setLoginHistory(mockData)
        setError(response.error || "Failed to load login history")
      }
    } catch (err) {
      console.error('❌ Login History Error:', err)
      setError("Failed to load login history")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800"
    
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "expired": return "bg-yellow-100 text-yellow-800"
      case "terminated": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return "N/A"
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const loginTime = new Date(dateString)
    const diffMs = now.getTime() - loginTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day(s) ago`
    if (diffHours > 0) return `${diffHours} hour(s) ago`
    if (diffMins > 0) return `${diffMins} minute(s) ago`
    return "Just now"
  }

  const filteredHistory = loginHistory.filter((entry) => {
    const matchesSearch = entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (entry.stationName && entry.stationName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "All" || entry.status === statusFilter

    const now = new Date()
    const loginTime = new Date(entry.loginTime)
    let matchesDate = true
    
    if (dateFilter === "Today") {
      matchesDate = loginTime.toDateString() === now.toDateString()
    } else if (dateFilter === "This Week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      matchesDate = loginTime >= weekAgo
    } else if (dateFilter === "This Month") {
      matchesDate = loginTime.getMonth() === now.getMonth() && loginTime.getFullYear() === now.getFullYear()
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const statusOptions = ["All", "Active", "Completed", "Expired", "Terminated"]
  const dateOptions = ["All", "Today", "This Week", "This Month"]

  // Calculate statistics
  const totalSessions = loginHistory.length
  const activeSessions = loginHistory.filter(entry => entry.status === "active").length
  const completedSessions = loginHistory.filter(entry => entry.status === "completed").length
  const averageSessionTime = loginHistory.length > 0 
    ? loginHistory.reduce((sum, entry) => sum + (entry.sessionDuration || 0), 0) / loginHistory.length 
    : 0

  if (!user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">You don&apos;t have permission to view login history.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login History</h1>
          <p className="text-gray-600">Monitor user login activity and security events</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🟢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{activeSessions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedSessions}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(averageSessionTime)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users, IPs, stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All Status" : status}
                  </option>
                ))}
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              >
                {dateOptions.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={loadLoginHistory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>🔄</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Login History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Login Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Station/IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Info
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((entry) => (
                  <tr key={entry.id || `entry-${Math.random()}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {(entry.username || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{entry.username || 'Unknown User'}</div>
                          <div className="text-sm text-gray-500">ID: {entry.userId || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entry.loginTime ? formatDateTime(entry.loginTime) : 'N/A'}</div>
                      <div className="text-sm text-gray-500">{entry.loginTime ? getTimeAgo(entry.loginTime) : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDuration(entry.sessionDuration)}</div>
                      {entry.logoutTime && (
                        <div className="text-sm text-gray-500">
                          Ended: {formatDateTime(entry.logoutTime)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {entry.stationName || "Web Access"}
                      </div>
                      <div className="text-sm text-gray-500">{entry.ipAddress || 'Unknown IP'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                        {entry.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.userAgent && (
                        <div className="text-sm text-gray-500 max-w-xs truncate" title={entry.userAgent}>
                          {entry.userAgent}
                        </div>
                      )}
                      {entry.stationId && (
                        <div className="text-sm text-gray-500">
                          Station: {entry.stationId}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <p className="text-gray-500">No login history found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {searchTerm || statusFilter !== "All" || dateFilter !== "All" 
                    ? "Try adjusting your filters" 
                    : "Login activity will appear here"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {filteredHistory.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Showing:</span>
                <span className="ml-2 text-gray-900">{filteredHistory.length} of {totalSessions} sessions</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Date Range:</span>
                <span className="ml-2 text-gray-900">{dateFilter}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status Filter:</span>
                <span className="ml-2 text-gray-900">{statusFilter}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
