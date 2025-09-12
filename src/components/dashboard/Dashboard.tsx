"use client"
import React, { useState, useEffect } from "react";
import { User } from "@/utils/auth";
import { apiService, Station } from "@/services/api";

interface DashboardProps {
  user: User;
  onPageChange?: (page: string) => void;
}

export default function Dashboard({ user, onPageChange }: DashboardProps) {
  const [stationNames, setStationNames] = useState<string[]>([])
  const [loadingStations, setLoadingStations] = useState(true)

  // Debug log to see user data structure
  console.log('🔍 Dashboard User Data:', user)
  console.log('🔍 Assigned Stations:', user.assignedStations)
  console.log('🔍 Station:', user.station)

  // Fetch station names based on assigned station IDs
  useEffect(() => {
    const fetchStationNames = async () => {
      console.log('🔍 Starting to fetch station names for user:', user.assignedStations)
      
      if (!user.assignedStations || user.assignedStations.length === 0) {
        console.log('🔍 No assigned stations found')
        setLoadingStations(false)
        return
      }

      try {
        console.log('🔍 Calling getStations API...')
        const response = await apiService.getStations()
        console.log('🔍 getStations response:', response)
        
        if (response.success && response.data) {
          console.log('🔍 All stations from API:', response.data)
          // Filter stations that match user's assigned station IDs
          const userStations = response.data.filter((station: Station) => 
            station.id && user.assignedStations.includes(station.id)
          )
          console.log('🔍 Filtered user stations:', userStations)
          
          const names = userStations.map((station: Station) => station.name)
          console.log('🔍 Station names extracted:', names)
          setStationNames(names)
        } else {
          console.error('🔍 Failed to get stations:', response.error)
        }
      } catch (error) {
        console.error('🔍 Error fetching station names:', error)
      } finally {
        setLoadingStations(false)
      }
    }

    fetchStationNames()
  }, [user.assignedStations])

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const statsCards = [
    {
      title: "Today's Sales",
      value: "$0.00",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
      textColor: "text-green-700",
      change: "No data",
      changeType: "neutral"
    },
    {
      title: "Monthly Sales",
      value: "$0.00",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200",
      textColor: "text-blue-700",
      change: "No data",
      changeType: "neutral"
    },
    {
      title: "Active Orders",
      value: "0",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200",
      textColor: "text-purple-700",
      change: "No data",
      changeType: "neutral"
    },
    {
      title: "Low Stock Items",
      value: "0",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      color: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200",
      textColor: "text-orange-700",
      change: "No data",
      changeType: "neutral"
    },
  ]

  const quickActions = [
    {
      title: "User Management",
      description: "Manage users and permissions",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
      roles: ["Super Admin"],
      disabled: false,
      page: "users",
    },
    {
      title: "Station Management",
      description: "Configure POS terminals",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      roles: ["Super Admin"],
      disabled: false,
      page: "stations",
    },
    {
      title: "Store Settings",
      description: "Manage store information",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
      roles: ["Super Admin", "Store Manager"],
      disabled: false,
      page: "stores",
    },
    {
      title: "System Status",
      description: "Monitor system health",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700",
      roles: ["Super Admin"],
      disabled: false,
      page: "system",
    },
  ]

  const filteredActions = quickActions.filter((action) => action.roles.includes(user.role))

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
                         <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName || user.username}!</h1>
            <p className="text-gray-600 mt-1">{currentDate}</p>
            <p className="text-sm text-gray-500 mt-1">
              Stations: {(() => {
                console.log('🔍 Rendering stations - loadingStations:', loadingStations, 'stationNames:', stationNames, 'assignedStations:', user.assignedStations)
                if (loadingStations) {
                  return 'Loading stations...'
                }
                if (!user.assignedStations || user.assignedStations.length === 0) {
                  return 'No stations assigned'
                }
                if (stationNames.length > 0) {
                  return stationNames.join(', ')
                }
                return `${user.assignedStations.length} station(s) assigned (IDs: ${user.assignedStations.join(', ')})`
              })()} • Role: {user.role}
            </p>
          </div>
          <div className="text-6xl">
            <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className={`${card.color} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.textColor} mt-1`}>{card.value}</p>
                {card.change && (
                  <p className={`text-xs font-medium mt-1 ${
                    card.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}>
                    {card.change}
                  </p>
                )}
              </div>
              <div className="text-3xl text-gray-600">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredActions.map((action, index) => (
            <button
              key={index}
              onClick={() => onPageChange && onPageChange(action.page)}
              disabled={action.disabled}
              className={`${
                action.disabled ? "bg-gray-100 border border-gray-200 cursor-not-allowed" : `${action.color} text-white hover:shadow-xl`
              } p-6 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] shadow-lg`}
            >
              <div className="mb-3">{action.icon}</div>
              <h3 className={`font-semibold mb-1 ${action.disabled ? "text-gray-700" : ""}`}>{action.title}</h3>
              <p className={`text-sm ${action.disabled ? "text-gray-600" : "text-white/80"}`}>{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl shadow-sm">
            <div className="text-lg text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">User logged in</p>
              <p className="text-xs text-gray-500">
                {user.firstName || user.username} {user.lastName} • {new Date(user.loginTime || Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl shadow-sm">
            <div className="text-lg text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Assigned Stations</p>
              <p className="text-xs text-gray-500">
                {(() => {
                  if (loadingStations) {
                    return 'Loading station information...'
                  }
                  if (!user.assignedStations || user.assignedStations.length === 0) {
                    return 'No stations assigned'
                  }
                  if (stationNames.length > 0) {
                    return `Connected to: ${stationNames.join(', ')}`
                  }
                  return `Connected to ${user.assignedStations.length} station(s)`
                })()}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-3 p-8 bg-white/80 rounded-xl shadow-sm">
            <div className="text-center">
              <div className="text-4xl text-gray-400 mb-2">
                <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No recent activity</p>
              <p className="text-xs text-gray-400">Activity will appear here as you use the system</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Summary */}
 
    </div>
  )
}
