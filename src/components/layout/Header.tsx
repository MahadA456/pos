"use client"
import { useState, useEffect } from "react";
import { User } from "@/utils/auth";
import { apiService, Station } from "@/services/api";
// import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [stationNames, setStationNames] = useState<string[]>([])
  const [loadingStations, setLoadingStations] = useState(true)
  const currentTime = new Date().toLocaleString()

  // Fetch station names based on assigned station IDs
  useEffect(() => {
    const fetchStationNames = async () => {
      console.log('🔍 Header: Starting to fetch station names for user:', user.assignedStations)
      
      if (!user.assignedStations || user.assignedStations.length === 0) {
        console.log('🔍 Header: No assigned stations found')
        setLoadingStations(false)
        return
      }

      try {
        console.log('🔍 Header: Calling getStations API...')
        const response = await apiService.getStations()
        console.log('🔍 Header: getStations response:', response)
        
        if (response.success && response.data) {
          console.log('🔍 Header: All stations from API:', response.data)
          // Filter stations that match user's assigned station IDs
          const userStations = response.data.filter((station: Station) => 
            station.id && user.assignedStations.includes(station.id)
          )
          console.log('🔍 Header: Filtered user stations:', userStations)
          
          const names = userStations.map((station: Station) => station.name)
          console.log('🔍 Header: Station names extracted:', names)
          setStationNames(names)
        } else {
          console.error('🔍 Header: Failed to get stations:', response.error)
        }
      } catch (error) {
        console.error('🔍 Header: Error fetching station names:', error)
      } finally {
        setLoadingStations(false)
      }
    }

    fetchStationNames()
  }, [user.assignedStations])

  return (
    <header className="bg-gradient-to-r from-white to-gray-50 shadow-lg border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">🏪</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">OneStep POS</h1>
            <div className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-lg shadow-sm">
              Stations: <span className="font-medium text-purple-600">
                {(() => {
                  if (loadingStations) {
                    return 'Loading...'
                  }
                  if (!user.assignedStations || user.assignedStations.length === 0) {
                    return 'None assigned'
                  }
                  if (stationNames.length > 0) {
                    return stationNames.join(', ')
                  }
                  return `${user.assignedStations.length} assigned`
                })()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-lg shadow-sm">{currentTime}</div>

            <div className="flex items-center space-x-2">
              <div className="text-sm bg-white/80 px-3 py-2 rounded-lg shadow-sm">
                                 <div className="font-medium text-gray-900">
                   {user.firstName || user.username} {user.lastName}
                 </div>
                <div className="text-purple-600 font-medium">{user.role}</div>
              </div>
              <button
                onClick={onLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
