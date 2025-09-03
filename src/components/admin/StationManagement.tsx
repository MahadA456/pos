"use client"

import { useState, useEffect } from "react"
import { apiService, Station } from "@/services/api"
import { authManager } from "@/utils/auth"

interface StationFormData {
  name: string;
  location: string;
  status: string;
  ipAddress: string;
  printerName: string;
  cashDrawer: string;
}

export default function StationManagement() {
  const user = authManager.getCurrentUser()
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingStation, setEditingStation] = useState<Station | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [formData, setFormData] = useState<StationFormData>({
    name: "",
    location: "",
    status: "Active",
    ipAddress: "",
    printerName: "",
    cashDrawer: "",
  })

  useEffect(() => {
    loadStations()
  }, [])

  const loadStations = async () => {
    try {
      setLoading(true)
      const response = await apiService.getStations()
      if (response.success && response.data) {
        setStations(response.data)
      } else {
        setError(response.error || "Failed to load stations")
      }
    } catch {
      setError("Failed to load stations")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let response
      if (editingStation) {
        response = await apiService.updateStation(editingStation.id!, formData)
      } else {
        response = await apiService.createStation(formData)
      }

      if (response.success) {
        await loadStations()
        setShowModal(false)
        resetForm()
      } else {
        setError(response.error || "Failed to save station")
      }
    } catch {
      setError("Failed to save station")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (station: Station) => {
    setEditingStation(station)
    setFormData({
      name: station.name,
      location: station.location,
      status: station.status,
      ipAddress: station.ipAddress,
      printerName: station.printerName,
      cashDrawer: station.cashDrawer,
    })
    setShowModal(true)
  }

  const handleDelete = async (station: Station) => {
    if (!window.confirm(`Are you sure you want to delete ${station.name}?`)) {
      return
    }

    try {
      setLoading(true)
      const response = await apiService.deleteStation(station.id!)
      if (response.success) {
        await loadStations()
      } else {
        setError(response.error || "Failed to delete station")
      }
    } catch {
      setError("Failed to delete station")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      status: "Active",
      ipAddress: "",
      printerName: "",
      cashDrawer: "",
    })
    setEditingStation(null)
  }

  const filteredStations = stations.filter((station) => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         station.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || station.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "maintenance": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const statusOptions = ["All", "Active", "Inactive", "Maintenance"]

  if (!user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">You don&apos;t have permission to manage stations.</p>
      </div>
    )
  }

  if (loading && stations.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Station Management</h1>
          <p className="text-gray-600">Manage your POS terminals and hardware configuration</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search stations..."
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
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowModal(true)
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>➕</span>
              Add Station
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💻</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stations</p>
                <p className="text-2xl font-bold text-gray-900">{stations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stations.filter(s => s.status.toLowerCase() === "active").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stations.filter(s => s.status.toLowerCase() === "maintenance").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stations.filter(s => s.status.toLowerCase() === "inactive").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Station Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hardware
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {station.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{station.name}</div>
                          <div className="text-sm text-gray-500">IP: {station.ipAddress}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{station.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Printer: {station.printerName}</div>
                      <div className="text-sm text-gray-500">Drawer: {station.cashDrawer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(station.status)}`}>
                        {station.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(station)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(station)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredStations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No stations found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingStation ? "Edit Station" : "Add New Station"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Station Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Main Register"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Front Counter"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({...formData, ipAddress: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="192.168.1.101"
                    pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Printer Name
                  </label>
                  <input
                    type="text"
                    value={formData.printerName}
                    onChange={(e) => setFormData({...formData, printerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="HP LaserJet Pro"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cash Drawer
                  </label>
                  <input
                    type="text"
                    value={formData.cashDrawer}
                    onChange={(e) => setFormData({...formData, cashDrawer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="Drawer A"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Saving..." : editingStation ? "Update Station" : "Add Station"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}