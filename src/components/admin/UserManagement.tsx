"use client"

import { useState } from "react"
import { mockUsers } from "@/data/mockData"
import AddUserModal from "./AddUserModal"
import EditUserModal from "./EditUserModal"

interface UserManagementProps {
  user: any
}

export default function UserManagement({ user }: UserManagementProps) {
  const [users, setUsers] = useState(mockUsers)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("firstName")
  const [sortDirection, setSortDirection] = useState("asc")

  // Check if user has permission
  if (user.role !== "Super Admin") {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access user management.</p>
        </div>
      </div>
    )
  }

  const handleAddUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: users.length + 1,
      createdAt: new Date().toISOString(),
      status: "Active",
    }
    setUsers([...users, userWithId])
    setShowAddModal(false)
  }

  const handleEditUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setEditingUser(null)
  }

  const handleDeleteUser = (userId) => {
    if (userId === user.id) {
      alert("You cannot delete your own account")
      return
    }

    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== userId))
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New User
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th
                  className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("firstName")}
                >
                  Name {sortField === "firstName" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("username")}
                >
                  Username {sortField === "username" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="text-left py-3 px-4 font-semibold cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("role")}
                >
                  Role {sortField === "role" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium">
                        {u.firstName} {u.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{u.username}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === "Super Admin"
                          ? "bg-red-100 text-red-800"
                          : u.role === "Store Manager"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.id === user.id}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">No users found matching your search.</div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onSave={handleAddUser} />}

      {editingUser && <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleEditUser} />}
    </div>
  )
}
