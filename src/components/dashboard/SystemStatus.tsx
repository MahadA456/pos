"use client"

import { useState, useEffect } from "react"
import { authManager } from "@/utils/auth"

export default function SystemStatus() {
  const user = authManager.getCurrentUser()
  const [systemStatus, setSystemStatus] = useState({
    database: "online",
    api: "online", 
    printers: "online",
    cashDrawers: "online",
    network: "online",
    lastUpdate: new Date()
  })

  const [performance, setPerformance] = useState({
    cpu: 45,
    memory: 62,
    disk: 28,
    network: 85
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        lastUpdate: new Date()
      }))
      
      setPerformance(prev => ({
        cpu: Math.max(20, Math.min(80, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(90, prev.memory + (Math.random() - 0.5) * 5)),
        disk: Math.max(20, Math.min(60, prev.disk + (Math.random() - 0.5) * 3)),
        network: Math.max(70, Math.min(95, prev.network + (Math.random() - 0.5) * 8))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">You don&apos;t have permission to view system status.</p>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800"
      case "warning": return "bg-yellow-100 text-yellow-800"
      case "offline": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPerformanceColor = (value: number) => {
    if (value < 50) return "bg-green-500"
    if (value < 75) return "bg-yellow-500"
    return "bg-red-500"
  }

  const systemComponents = [
    { name: "Database", status: systemStatus.database, icon: "🗄️" },
    { name: "API Server", status: systemStatus.api, icon: "🌐" },
    { name: "Printers", status: systemStatus.printers, icon: "🖨️" },
    { name: "Cash Drawers", status: systemStatus.cashDrawers, icon: "💰" },
    { name: "Network", status: systemStatus.network, icon: "📡" }
  ]

  const performanceMetrics = [
    { name: "CPU Usage", value: performance.cpu, icon: "⚡" },
    { name: "Memory", value: performance.memory, icon: "🧠" },
    { name: "Disk Space", value: performance.disk, icon: "💾" },
    { name: "Network", value: performance.network, icon: "🌐" }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">System Status</h2>
          <p className="text-sm text-gray-600">Real-time system health and performance</p>
        </div>
        <div className="text-xs text-gray-500">
          Last updated: {systemStatus.lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* System Components Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">System Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {systemComponents.map((component, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-lg">{component.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{component.name}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(component.status)}`}>
                  {component.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{metric.icon}</span>
                <span className="text-sm font-medium text-gray-600">{metric.value}%</span>
              </div>
              <div className="text-sm font-medium text-gray-900 mb-2">{metric.name}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getPerformanceColor(metric.value)}`}
                  style={{ width: `${metric.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">System Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Version:</span>
              <span className="text-blue-900">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Uptime:</span>
              <span className="text-blue-900">7 days, 14 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Last Backup:</span>
              <span className="text-blue-900">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Active Users:</span>
              <span className="text-blue-900">3</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-900 mb-2">Security Status</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Firewall:</span>
              <span className="text-green-900">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">SSL Certificate:</span>
              <span className="text-green-900">Valid</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Last Scan:</span>
              <span className="text-green-900">1 hour ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Threats:</span>
              <span className="text-green-900">0 detected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex space-x-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
          Refresh Status
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          View Logs
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
          System Info
        </button>
      </div>
    </div>
  )
}
