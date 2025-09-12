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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Login History</h3>
        <p className="text-gray-600">Please wait while we fetch login data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Login History</h1>
                <p className="text-gray-600 mt-1">Monitor user login activity and security events</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-indigo-700">Security Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Login History</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">{totalSessions}</div>
                <div className="text-sm font-semibold text-blue-700">Total Sessions</div>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">{activeSessions}</div>
                <div className="text-sm font-semibold text-green-700">Active Sessions</div>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">{completedSessions}</div>
                <div className="text-sm font-semibold text-purple-700">Completed</div>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">{formatDuration(averageSessionTime)}</div>
                <div className="text-sm font-semibold text-orange-700">Avg. Session</div>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Search & Filter</h2>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Login History</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                <input
                  type="text"
                  placeholder="Search users, IPs, stations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 bg-white shadow-sm"
                />
                </div>
              </div>
              <div className="sm:w-48">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-900 shadow-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All Status" : status}
                  </option>
                ))}
              </select>
              </div>
              <div className="sm:w-48">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date Filter</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-gray-900 shadow-sm"
              >
                {dateOptions.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              </div>
            </div>
            <button
              onClick={loadLoginHistory}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Login History Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Login Sessions</h2>
              <div className="ml-auto">
                <span className="text-sm text-gray-500">
                  {filteredHistory.length} of {totalSessions} sessions
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Login Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Station/IP</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Session Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHistory.map((entry) => (
                  <tr key={entry.id || `entry-${Math.random()}`} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                            {(entry.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">{entry.username || 'Unknown User'}</div>
                          <div className="text-sm text-gray-500">ID: {entry.userId || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{entry.loginTime ? formatDateTime(entry.loginTime) : 'N/A'}</div>
                      <div className="text-sm text-gray-500">{entry.loginTime ? getTimeAgo(entry.loginTime) : 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{formatDuration(entry.sessionDuration)}</div>
                      {entry.logoutTime && (
                        <div className="text-sm text-gray-500">
                          Ended: {formatDateTime(entry.logoutTime)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {entry.stationName || "Web Access"}
                      </div>
                      <div className="text-sm text-gray-500">{entry.ipAddress || 'Unknown IP'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(entry.status)}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          entry.status === 'active' ? 'bg-green-500' :
                          entry.status === 'completed' ? 'bg-blue-500' :
                          entry.status === 'expired' ? 'bg-yellow-500' :
                          entry.status === 'terminated' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}></div>
                        {entry.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
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
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Login History Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "All" || dateFilter !== "All" 
                    ? "Try adjusting your filters to see more results" 
                    : "Login activity will appear here when users sign in"}
                </p>
                {(searchTerm || statusFilter !== "All" || dateFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("All")
                      setDateFilter("All")
                    }}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {filteredHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Showing</div>
                <div className="text-2xl font-bold text-gray-900">{filteredHistory.length} of {totalSessions} sessions</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Date Range</div>
                <div className="text-lg font-semibold text-gray-900">{dateFilter}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm font-medium text-gray-600 mb-1">Status Filter</div>
                <div className="text-lg font-semibold text-gray-900">{statusFilter}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
