"use client"

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: string;
  status: string;
  assignedStations: string[];
  createdAt: string;
  station: {
    id: string;
    name: string;
    location: string;
    status: string;
    ipAddress: string;
    printerName: string;
    cashDrawer: string;
  };
  loginTime: string;
  rememberMe: boolean;
}

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
      id: "settings",
      name: "Settings",
      icon: "⚙️",
      roles: ["Super Admin", "Store Manager", "Cashier"],
    },
  ]

  const filteredItems = menuItems.filter((item) => item.roles.includes(user.role))

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => !item.disabled && onPageChange(item.id)}
                disabled={item.disabled}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  currentPage === item.id
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                    : item.disabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
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
