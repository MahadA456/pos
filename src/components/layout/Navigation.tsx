"use client"
import { User } from "@/utils/auth";

interface NavigationProps {
  user: User;
  currentPage: string;
  onPageChange: (page: string) => void;
}
    
export default function Navigation({ user, currentPage, onPageChange }: NavigationProps) {
  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: "🏠",
      roles: ["Super Admin", "Store Manager", "Cashier"],
    },
    {
      id: "pos",
      name: "Point of Sale",
      icon: "💳",
      roles: ["Super Admin", "Store Manager", "Cashier"],
      disabled: true,
      comingSoon: "Phase 2",
    },
    {
      id: "inventory",
      name: "Inventory",
      icon: "📦",
      roles: ["Super Admin", "Store Manager"],
      disabled: true,
      comingSoon: "Phase 3",
    },
    {
      id: "customers",
      name: "Customers",
      icon: "👥",
      roles: ["Super Admin", "Store Manager"],
      disabled: true,
      comingSoon: "Phase 4",
    },
    {
      id: "reports",
      name: "Reports",
      icon: "📊",
      roles: ["Super Admin", "Store Manager"],
      disabled: true,
      comingSoon: "Phase 8",
    },
    {
      id: "users",
      name: "User Management",
      icon: "👤",
      roles: ["Super Admin"],
    },
    {
      id: "loginHistory",
      name: "Login History",
      icon: "📋",
      roles: ["Super Admin"],
    },
    {
      id: "stations",
      name: "Station Management",
      icon: "💻",
      roles: ["Super Admin"],
    },
    {
      id: "stores",
      name: "Store Management",
      icon: "🏪",
      roles: ["Super Admin", "Store Manager"],
    },
    {
      id: "system-config",
      name: "System Config",
      icon: "🔧",
      roles: ["Super Admin", "Store Manager"],
    },
    {
      id: "file-management", 
      name: "File Management",
      icon: "📁",
      roles: ["Super Admin", "Store Manager"],
    },
    {
      id: "settings",
      name: "User Settings",
      icon: "⚙️",
      roles: ["Super Admin", "Store Manager", "Cashier"],
    },
  ]

  // Normalize role names for comparison
  const normalizeRole = (role: string) => {
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': 'Super Admin',
      'STORE_MANAGER': 'Store Manager',
      'CASHIER': 'Cashier'
    }
    return roleMap[role] || role
  }

  const filteredItems = menuItems.filter((item) => item.roles.includes(normalizeRole(user.role)))

  return (
    <nav className="w-64 bg-gradient-to-b from-white to-gray-50 shadow-lg border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => !item.disabled && onPageChange(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-l-4 border-purple-600 shadow-sm"
                    : item.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 hover:text-purple-600"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  {item.comingSoon && <div className="text-xs text-gray-500">Coming in {item.comingSoon}</div>}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
