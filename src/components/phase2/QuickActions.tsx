"use client"

import { useState } from "react"
import { User } from "@/utils/auth"
import { Card, CardHeader } from "@/components/ui/Card"
import { Button } from "@/components/ui/FormComponents"

interface QuickActionsProps {
  user: User
  onActionComplete?: (action: string) => void
}

export default function QuickActions({ user, onActionComplete }: QuickActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleQuickAction = async (action: string) => {
    setLoading(action)
    
    // Simulate action processing
    setTimeout(() => {
      setLoading(null)
      onActionComplete?.(action)
      
      // Show action-specific feedback
      switch (action) {
        case 'backup':
          alert("✅ Manual backup created successfully!")
          break
        case 'health-check':
          alert("✅ System health check completed - All systems operational!")
          break
        case 'tax-update':
          alert("✅ Tax rates updated and applied to all products!")
          break
        case 'sync-inventory':
          alert("✅ Inventory synchronized across all stations!")
          break
        default:
          alert(`✅ ${action} completed successfully!`)
      }
    }, 2000)
  }

  const quickActions = [
    {
      id: 'backup',
      title: 'Emergency Backup',
      description: 'Create immediate system backup',
      icon: '💾',
      color: 'bg-green-600 hover:bg-green-700',
      roles: ['Super Admin', 'Store Manager']
    },
    {
      id: 'health-check',
      title: 'System Health Check',
      description: 'Verify all systems are running properly',
      icon: '🏥',
      color: 'bg-blue-600 hover:bg-blue-700',
      roles: ['Super Admin']
    },
    {
      id: 'tax-update',
      title: 'Update Tax Rates',
      description: 'Apply current tax rates to all products',
      icon: '💰',
      color: 'bg-purple-600 hover:bg-purple-700',
      roles: ['Super Admin', 'Store Manager']
    },
    {
      id: 'sync-inventory',
      title: 'Sync Inventory',
      description: 'Synchronize inventory across all stations',
      icon: '🔄',
      color: 'bg-orange-600 hover:bg-orange-700',
      roles: ['Super Admin', 'Store Manager']
    },
    {
      id: 'clear-cache',
      title: 'Clear System Cache',
      description: 'Clear temporary files and cache',
      icon: '🧹',
      color: 'bg-gray-600 hover:bg-gray-700',
      roles: ['Super Admin']
    },
    {
      id: 'export-logs',
      title: 'Export System Logs',
      description: 'Download recent system activity logs',
      icon: '📋',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      roles: ['Super Admin']
    }
  ]

  // Filter actions based on user role
  const availableActions = quickActions.filter(action => 
    action.roles.some(role => 
      role === user.role || 
      (role === 'Store Manager' && ['MANAGER', 'STORE_MANAGER'].includes(user.role)) ||
      (role === 'Super Admin' && user.role === 'SUPER_ADMIN')
    )
  )

  return (
    <Card>
      <CardHeader 
        title="Quick Actions" 
        subtitle="Perform common system tasks quickly"
        icon="⚡"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action.id)}
            disabled={loading === action.id}
            className={`${action.color} text-white p-4 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-2xl mb-2">{action.icon}</div>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-white/80">{action.description}</p>
              </div>
              {loading === action.id && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">System Status Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">🟢</div>
            <div className="text-sm font-medium text-gray-900">Database</div>
            <div className="text-xs text-gray-600">Healthy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🟢</div>
            <div className="text-sm font-medium text-gray-900">API</div>
            <div className="text-xs text-gray-600">Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🟡</div>
            <div className="text-sm font-medium text-gray-900">Storage</div>
            <div className="text-xs text-gray-600">75% Used</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🟢</div>
            <div className="text-sm font-medium text-gray-900">Backup</div>
            <div className="text-xs text-gray-600">Up to Date</div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Recent System Activity</h4>
        <div className="space-y-3">
          {[
            { action: "Tax rate updated", user: "Admin", time: "2 minutes ago", icon: "💰" },
            { action: "Backup completed", user: "System", time: "1 hour ago", icon: "💾" },
            { action: "User permissions modified", user: "Admin", time: "3 hours ago", icon: "👤" },
            { action: "Store settings changed", user: "Manager", time: "1 day ago", icon: "🏪" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 text-sm">
              <span className="text-lg">{activity.icon}</span>
              <span className="flex-1 text-gray-900">{activity.action}</span>
              <span className="text-gray-600">by {activity.user}</span>
              <span className="text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
