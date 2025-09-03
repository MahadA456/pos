"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { apiService, CreateUserRequest, Station } from "@/services/api"

interface FormErrors {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  password?: string
  role?: string
  stationIds?: string
}

interface AddUserModalProps {
  onClose: () => void;
  onSave: (user: CreateUserRequest) => void;
}

export default function AddUserModal({ onClose, onSave }: AddUserModalProps) {
  const [stations, setStations] = useState<Station[]>([])
  const [loadingStations, setLoadingStations] = useState(true)
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "CASHIER",
    stationIds: [],
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Fetch stations on component mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoadingStations(true)
        const response = await apiService.getStations()
        if (response.success && response.data) {
          setStations(response.data)
        } else {
          console.error('Failed to fetch stations:', response.error)
          // You could set an error state here if needed
        }
      } catch (error) {
        console.error('Error fetching stations:', error)
      } finally {
        setLoadingStations(false)
      }
    }

    fetchStations()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleStationChange = (stationId: string) => {
    setFormData((prev) => ({
      ...prev,
      stationIds: prev.stationIds?.includes(stationId)
        ? prev.stationIds.filter((id) => id !== stationId)
        : [...(prev.stationIds || []), stationId],
    }))
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (!formData.role) newErrors.role = "Role is required"
    if (!formData.stationIds || formData.stationIds.length === 0) {
      newErrors.stationIds = "At least one station must be assigned"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Add New User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="CASHIER">Cashier</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Stations *</label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
              {loadingStations ? (
                <div className="text-center py-2 text-gray-500">Loading stations...</div>
              ) : stations.length > 0 ? (
                stations.filter(station => station.id).map((station) => (
                  <label key={station.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.stationIds?.includes(station.id!) || false}
                      onChange={() => handleStationChange(station.id!)}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {station.name} - {station.location}
                    </span>
                  </label>
                ))
              ) : (
                <div className="text-center py-2 text-gray-500">No stations available</div>
              )}
            </div>
            {errors.stationIds && <p className="text-red-500 text-xs mt-1">{errors.stationIds}</p>}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
