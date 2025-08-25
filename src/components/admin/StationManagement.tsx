"use client"

import { useState } from "react"
import { User } from "@/utils/auth"

interface Station {
  id: string
  name: string
  location: string
  status: "active" | "inactive" | "maintenance"
  ipAddress: string
  printerName: string
  cashDrawer: string
  assignedUsers: string[]
  lastActivity: string
}

interface StationManagementProps {
  user: User
}

export default function StationManagement({ user }: StationManagementProps) {
  const [stations, setStations] = useState<Station[]>([
    {
      id: "ST001",
      name: "Main Register",
      location: "Front Counter",
      status: "active",
      ipAddress: "192.168.1.101",
      printerName: "HP LaserJet Pro",
      cashDrawer: "Drawer A",
      assignedUsers: ["john.doe", "jane.smith"],
      lastActivity: "2024-01-15 14:30:00"
    },
    {
      id: "ST002", 
      name: "Secondary Register",
      location: "Back Counter",
      status: "active",
      ipAddress: "192.168.1.102",
      printerName: "Epson TM-T88VI",
      cashDrawer: "Drawer B",
      assignedUsers: ["mike.wilson"],
      lastActivity: "2024-01-15 13:45:00"
    },
    {
      id: "ST003",
      name: "Mobile POS",
      location: "Showroom Floor",
      status: "maintenance",
      ipAddress: "192.168.1.103",
      printerName: "Mobile Printer",
      cashDrawer: "Mobile Drawer",
      assignedUsers: ["sarah.jones"],
      lastActivity: "2024-01-15 12:15:00"
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "maintenance": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Station Management</h2>
          <p className="text-gray-600">Manage POS terminals and register assignments</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New Station
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <div key={station.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>
                <p className="text-sm text-gray-600">{station.location}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
                {station.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">IP Address:</span>
                <span className="font-mono text-gray-900">{station.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Printer:</span>
                <span className="text-gray-900">{station.printerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cash Drawer:</span>
                <span className="text-gray-900">{station.cashDrawer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assigned Users:</span>
                <span className="text-gray-900">{station.assignedUsers.length}</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stations.length}</div>
          <div className="text-sm text-blue-700">Total Stations</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {stations.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-green-700">Active Stations</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {stations.filter(s => s.status === 'maintenance').length}
          </div>
          <div className="text-sm text-yellow-700">In Maintenance</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-600">
            {stations.reduce((acc, station) => acc + station.assignedUsers.length, 0)}
          </div>
          <div className="text-sm text-gray-700">Assigned Users</div>
        </div>
      </div>
    </div>
  )
}
