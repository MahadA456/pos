"use client"
import React, { useState, useEffect } from "react";
import { User } from "@/utils/auth";
import { apiService, Station } from "@/services/api";

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
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
      icon: "💰",
      color: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
      textColor: "text-green-700",
      change: "No data",
      changeType: "neutral"
    },
    {
      title: "Monthly Sales",
      value: "$0.00",
      icon: "📊",
      color: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200",
      textColor: "text-blue-700",
      change: "No data",
      changeType: "neutral"
    },
    {
      title: "Active Orders",
      value: "0",
      icon: "📦",
      color: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200",
      textColor: "text-purple-700",
      change: "No data",
      changeType: "neutral"
    },
    {
      title: "Low Stock Items",
      value: "0",
      icon: "⚠️",
      color: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200",
      textColor: "text-orange-700",
      change: "No data",
      changeType: "neutral"
    },
  ]

  const quickActions = [
    {
      title: "New Sale",
      description: "Start a new transaction",
      icon: "💳",
      color: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700",
      roles: ["Super Admin", "Store Manager", "Cashier"],
      disabled: true,
      comingSoon: "Phase 2",
    },
    {
      title: "Add Product",
      description: "Add new inventory item",
      icon: "➕",
      color: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
      roles: ["Super Admin", "Store Manager"],
      disabled: true,
      comingSoon: "Phase 3",
    },
    {
      title: "Customer Lookup",
      description: "Find customer information",
      icon: "🔍",
      color: "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700",
      roles: ["Super Admin", "Store Manager", "Cashier"],
      disabled: true,
      comingSoon: "Phase 4",
    },
    {
      title: "Daily Report",
      description: "View today's summary",
      icon: "📊",
      color: "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700",
      roles: ["Super Admin", "Store Manager"],
      disabled: true,
      comingSoon: "Phase 8",
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
          <div className="text-6xl">👋</div>
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
              <div className="text-3xl">{card.icon}</div>
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
              disabled={action.disabled}
              className={`${
                action.disabled ? "bg-gray-100 border border-gray-200 cursor-not-allowed" : `${action.color} text-white`
              } p-6 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] shadow-lg`}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className={`font-semibold mb-1 ${action.disabled ? "text-gray-700" : ""}`}>{action.title}</h3>
              <p className={`text-sm ${action.disabled ? "text-gray-600" : "text-white/80"}`}>{action.description}</p>
              {action.comingSoon && <p className="text-xs mt-2 text-gray-500">Coming in {action.comingSoon}</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl shadow-sm">
            <div className="text-lg">🔐</div>
            <div>
              <p className="text-sm font-medium">User logged in</p>
              <p className="text-xs text-gray-500">
                {user.firstName || user.username} {user.lastName} • {new Date(user.loginTime || Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl shadow-sm">
            <div className="text-lg">🖥️</div>
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
              <div className="text-4xl text-gray-400 mb-2">📋</div>
              <p className="text-sm text-gray-500">No recent activity</p>
              <p className="text-xs text-gray-400">Activity will appear here as you use the system</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-green-900">System Health</h3>
              <p className="text-2xl font-bold text-green-700">98%</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Active Stations</h3>
              <p className="text-2xl font-bold text-blue-700">3/3</p>
            </div>
            <div className="text-2xl">💻</div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-purple-900">Online Users</h3>
              <p className="text-2xl font-bold text-purple-700">4</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>
      </div>
    </div>
  )
}
