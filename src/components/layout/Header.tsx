"use client"
import { User } from "@/utils/auth";

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const currentTime = new Date().toLocaleString()

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
              Station: <span className="font-medium text-purple-600">{user.station?.name || 'Not assigned'}</span>
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
