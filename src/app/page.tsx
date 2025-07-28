"use client"

import { useEffect, useState } from "react"
import LoginPage from "@/components/auth/LoginPage"
import Dashboard from "@/components/dashboard/Dashboard"
import UserManagement from "@/components/admin/UserManagement"
import Settings from "@/components/settings/Settings"
import Layout from "@/components/layout/Layout"

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("oneStepUser")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem("oneStepUser", JSON.stringify(user))
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("oneStepUser")
    setCurrentPage("dashboard")
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard user={currentUser} />
      case "users":
        return <UserManagement user={currentUser} />
      case "settings":
        return <Settings user={currentUser} />
      default:
        return <Dashboard user={currentUser} />
    }
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout} currentPage={currentPage} onPageChange={handlePageChange}>
      {renderPage()}
    </Layout>
  )
}
