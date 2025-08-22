"use client"
import React from "react";

interface User {
  firstName: string;
  lastName: string;
  role: string;
  station: {
    name: string;
  };
  loginTime: string;
}

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const statsCards = [
    {
      title: "Today's Sales",
      value: "$1,234.56",
      icon: "💰",
      color: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      title: "Items in Stock",
      value: "1,456",
      icon: "📦",
      color: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "Active Customers",
      value: "234",
      icon: "👥",
      color: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200",
      textColor: "text-purple-700",
    },
    {
      title: "Pending Orders",
      value: "12",
      icon: "📋",
      color: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200",
      textColor: "text-orange-700",
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
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
            <p className="text-gray-600 mt-1">{currentDate}</p>
            <p className="text-sm text-gray-500 mt-1">
              Station: {user.station?.name || 'Not assigned'} • Role: {user.role}
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
                {user.firstName} {user.lastName} • {new Date(user.loginTime || Date.now()).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl shadow-sm">
            <div className="text-lg">🖥️</div>
            <div>
              <p className="text-sm font-medium">Station assigned</p>
              <p className="text-xs text-gray-500">Connected to {user.station?.name || 'Not assigned'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
