"use client"

import { useState } from "react"

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

interface SettingsProps {
  user: User;
}

export default function Settings({ user }: SettingsProps) {
  const [userPreferences, setUserPreferences] = useState({
    theme: "light",
    language: "en",
    notifications: true,
    emailAlerts: false,
    displayDensity: "comfortable",
  })

  const [storeInfo, setStoreInfo] = useState({
    storeName: "OneStep Gun Store",
    address: "123 Main Street",
    city: "Anytown",
    state: "TX",
    zipCode: "12345",
    phone: "(555) 123-4567",
    email: "info@onestepgunstore.com",
    website: "www.onestepgunstore.com",
  })

  const [systemSettings, setSystemSettings] = useState({
    taxRate: "8.25",
    currency: "USD",
    timeZone: "America/Chicago",
    dateFormat: "MM/DD/YYYY",
    receiptFooter: "Thank you for your business!",
  })

  const [successMessage, setSuccessMessage] = useState("")

  const handleUserPreferenceChange = (key: string, value: string | boolean) => {
    setUserPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleStoreInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStoreInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSystemSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSystemSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const saveUserPreferences = () => {
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences))
    setSuccessMessage("User preferences saved successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const saveStoreInfo = () => {
    localStorage.setItem("storeInfo", JSON.stringify(storeInfo))
    setSuccessMessage("Store information saved successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const saveSystemSettings = () => {
    if (user.role !== "Super Admin") {
      alert("Only Super Admin can modify system settings")
      return
    }
    localStorage.setItem("systemSettings", JSON.stringify(systemSettings))
    setSuccessMessage("System settings saved successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* User Preferences */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select
                value={userPreferences.theme}
                onChange={(e) => handleUserPreferenceChange("theme", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={userPreferences.language}
                onChange={(e) => handleUserPreferenceChange("language", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Density</label>
              <select
                value={userPreferences.displayDensity}
                onChange={(e) => handleUserPreferenceChange("displayDensity", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={userPreferences.notifications}
                  onChange={(e) => handleUserPreferenceChange("notifications", e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Enable notifications</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={userPreferences.emailAlerts}
                  onChange={(e) => handleUserPreferenceChange("emailAlerts", e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Email alerts</span>
              </label>
            </div>
          </div>
          <button
            onClick={saveUserPreferences}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Preferences
          </button>
        </div>

        {/* Store Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={storeInfo.storeName}
                onChange={handleStoreInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={storeInfo.phone}
                onChange={handleStoreInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={storeInfo.address}
                onChange={handleStoreInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={storeInfo.city}
                onChange={handleStoreInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={storeInfo.state}
                  onChange={handleStoreInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={storeInfo.zipCode}
                  onChange={handleStoreInfoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={storeInfo.email}
                onChange={handleStoreInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="text"
                name="website"
                value={storeInfo.website}
                onChange={handleStoreInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={saveStoreInfo}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Store Information
          </button>
        </div>

        {/* System Settings */}
        {user.role === "Super Admin" && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                <input
                  type="text"
                  name="taxRate"
                  value={systemSettings.taxRate}
                  onChange={handleSystemSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  name="currency"
                  value={systemSettings.currency}
                  onChange={handleSystemSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <select
                  name="timeZone"
                  value={systemSettings.timeZone}
                  onChange={handleSystemSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  name="dateFormat"
                  value={systemSettings.dateFormat}
                  onChange={handleSystemSettingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Receipt Footer Message</label>
                <textarea
                  name="receiptFooter"
                  value={systemSettings.receiptFooter}
                  onChange={handleSystemSettingChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={saveSystemSettings}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save System Settings
            </button>
          </div>
        )}

        {/* Access Denied for System Settings */}
        {user.role !== "Super Admin" && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">🔒</div>
              <p className="text-gray-600">Only Super Admin can access system settings</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
