"use client"

interface HeaderProps {
  user: any
  onLogout: () => void
}

export default function Header({ user, onLogout }: HeaderProps) {
  const currentTime = new Date().toLocaleString()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">OneStep POS</h1>
            <div className="text-sm text-gray-600">
              Station: <span className="font-medium">{user.station.name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-sm text-gray-600">{currentTime}</div>
            <div className="flex items-center space-x-2">
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-gray-600">{user.role}</div>
              </div>
              <button
                onClick={onLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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
