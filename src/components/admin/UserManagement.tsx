"use client"

import { useState, useEffect } from "react"
import { User } from "@/utils/auth"
import { apiService, User as ApiUser, CreateUserRequest } from "@/services/api"
import AddUserModal from "./AddUserModal"

interface UserManagementProps {
  user: User
}

export default function UserManagement({ user: _user }: UserManagementProps) {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [showAddModal, setShowAddModal] = useState(false)
  const [_selectedUser, setSelectedUser] = useState<ApiUser | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAllUsers()
      console.log('📊 Users Response:', response)
      
      if (response.success && response.data) {
        console.log('📋 Users Data:', response.data)
        setUsers(response.data)
        setError("")
      } else {
        setError(response.error || "Failed to load users")
      }
    } catch (err) {
      console.error('❌ Users Error:', err)
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData: CreateUserRequest) => {
    try {
      const response = await apiService.createUser(userData)
      
      if (response.success && response.data) {
        console.log('✅ User created successfully:', response.data)
        await loadUsers() // Reload users list
        setShowAddModal(false)
        setError("")
      } else {
        setError(response.error || "Failed to create user")
      }
    } catch (err) {
      console.error('❌ Create User Error:', err)
      setError("Failed to create user")
    }
  }

  const getStatusColor = (enabled: boolean) => {
    return enabled 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800"
  }

  const getStatusText = (enabled: boolean) => {
    return enabled ? "Active" : "Inactive"
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "bg-purple-100 text-purple-800"
      case "STORE_MANAGER": return "bg-blue-100 text-blue-800"
      case "CASHIER": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "Super Admin"
      case "STORE_MANAGER": return "Store Manager"
      case "CASHIER": return "Cashier"
      default: return role
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage employees, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New User
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => {
              setError("")
              loadUsers()
            }}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="STORE_MANAGER">Store Manager</option>
            <option value="CASHIER">Cashier</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Stations</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Login</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-600">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.enabled)}`}>
                    {getStatusText(user.enabled)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {user.assignedStations?.length || 0} station(s)
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.assignedStations?.map(station => station.name).join(', ') || 'None'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    N/A
                  </div>
                  <div className="text-xs text-gray-500">
                    {/* Last login not in User model */}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                      Permissions
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-blue-700">Total Users</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {users.filter(u => u.enabled === true).length}
          </div>
          <div className="text-sm text-green-700">Active Users</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.role === 'SUPER_ADMIN').length}
          </div>
          <div className="text-sm text-purple-700">Admins</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {users.filter(u => u.role === 'CASHIER').length}
          </div>
          <div className="text-sm text-orange-700">Cashiers</div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleCreateUser}
        />
      )}
        </>
      )}
    </div>
  )
}
