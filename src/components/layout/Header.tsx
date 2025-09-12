"use client"
import { useState, useEffect } from "react";
import { User } from "@/utils/auth";
import { apiService, Station } from "@/services/api";

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [stationNames, setStationNames] = useState<string[]>([])
  const [loadingStations, setLoadingStations] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Online status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Fetch station names based on assigned station IDs
  useEffect(() => {
    const fetchStationNames = async () => {
      if (!user.assignedStations || user.assignedStations.length === 0) {
        setLoadingStations(false)
        return
      }

      try {
        const response = await apiService.getStations()
        
        if (response.success && response.data) {
          const userStations = response.data.filter((station: Station) => 
            station.id && user.assignedStations.includes(station.id)
          )
          const names = userStations.map((station: Station) => station.name)
          setStationNames(names)
        }
      } catch (error) {
        console.error('Error fetching station names:', error)
      } finally {
        setLoadingStations(false)
      }
    }

    fetchStationNames()
  }, [user.assignedStations])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <header className="bg-white shadow-xl border-b border-gray-100">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
        

          {/* Center Section - Real-time Clock */}
          <div className="hidden md:flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-2xl font-mono font-bold text-gray-900">
                {formatTime(currentTime)}
              </span>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Right Section - User Info & Actions */}
          <div className="flex items-center space-x-4">
            {/* Online Status */}
            <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {(user.firstName || user.username).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">
                  {user.firstName || user.username} {user.lastName}
                </div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Clock */}
        <div className="md:hidden mt-3 flex items-center justify-center">
          <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-mono font-bold text-gray-900">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
