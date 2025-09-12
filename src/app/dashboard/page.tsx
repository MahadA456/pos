"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authManager } from "@/utils/auth"
import { User } from "@/utils/auth"
import Dashboard from "@/components/dashboard/Dashboard"
import Layout from "@/components/layout/Layout"

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing JWT session
    if (authManager.isAuthenticated() && !authManager.isTokenExpired()) {
      const user = authManager.getCurrentUser()
      if (user) {
        setCurrentUser(user)
      }
    } else {
      // Redirect to login if not authenticated
      router.push("/login")
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    setCurrentUser(null)
    authManager.logout()
    router.push("/")
  }

  const handlePageChange = (page: string) => {
    router.push(`/${page}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!currentUser) {
    return null // Will redirect to login
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout} currentPage="dashboard" onPageChange={handlePageChange}>
      <Dashboard user={currentUser} onPageChange={handlePageChange} />
    </Layout>
  )
}
