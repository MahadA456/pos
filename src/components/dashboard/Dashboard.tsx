"use client"

interface DashboardProps {
  user: any
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
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
    },
    {
      title: "Items in Stock",
      value: "1,456",
      icon: "📦",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      title: "Active Customers",
      value: "234",
      icon: "👥",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
    },
    {
      title: "Pending Orders",
      value: "12",
      icon: "📋",
      color: "bg-orange-50 border-orange-200",
      textColor: "text-orange-700",
    },
  ]

  const quickActions = [
    {
      title: "New Sale",
      description: "Start a new transaction",
      icon: "💳",
      color: "bg-blue-600 hover:bg-blue-700",
      roles: ["Super Admin", "Store Manager", "Cashier"],
      disabled: true,
      comingSoon: "Phase 2",
    },
    {
      title: "Add Product",
      description: "Add new inventory item",
      icon: "➕",
      color: "bg-green-600 hover:bg-green-700",
      roles: ["Super Admin", "Store Manager"],
      disabled: true,
      comingSoon: "Phase 3",
    },
    {
      title: "Customer Lookup",
      description: "Find customer information",
      icon: "🔍",
      color: "bg-purple-600 hover:bg-purple-700",
      roles: ["Super Admin", "Store Manager", "Cashier"],
      disabled: true,
      comingSoon: "Phase 4",
    },
    {
      title: "Daily Report",
      description: "View today's summary",
      icon: "📊",
      color: "bg-orange-600 hover:bg-orange-700",
      roles: ["Super Admin", "Store Manager"],
      disabled: true,
      comingSoon: "Phase 8",
    },
  ]

  const filteredActions = quickActions.filter((action) => action.roles.includes(user.role))

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}!</h1>
            <p className="text-gray-600 mt-1">{currentDate}</p>
            <p className="text-sm text-gray-500 mt-1">
              Station: {user.station.name} • Role: {user.role}
            </p>
          </div>
          <div className="text-6xl">👋</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className={`${card.color} border rounded-lg p-6`}>
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
                action.disabled ? "bg-gray-300 cursor-not-allowed" : `${action.color} text-white`
              } p-6 rounded-lg text-left transition-colors`}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className={`text-sm ${action.disabled ? "text-gray-600" : "text-white/80"}`}>{action.description}</p>
              {action.comingSoon && <p className="text-xs mt-2 text-gray-600">Coming in {action.comingSoon}</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-lg">🔐</div>
            <div>
              <p className="text-sm font-medium">User logged in</p>
              <p className="text-xs text-gray-500">
                {user.firstName} {user.lastName} • {new Date(user.loginTime).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-lg">🖥️</div>
            <div>
              <p className="text-sm font-medium">Station assigned</p>
              <p className="text-xs text-gray-500">Connected to {user.station.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
