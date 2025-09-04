"use client"

import { useState, useEffect } from "react"
import { User } from "@/utils/auth"
import { mockStoreConfig, StoreConfiguration, mockSystemAlerts } from "@/data/phase2MockData"
import { Tooltip, HelpButton } from "@/components/ui/Tooltip"
import QuickActions from "@/components/phase2/QuickActions"

interface SystemConfigProps {
  user: User;
}

export default function SystemConfig({ user }: SystemConfigProps) {
  const [config, setConfig] = useState<StoreConfiguration>(mockStoreConfig)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [activeTab, setActiveTab] = useState("store")

  const handleStoreInfoChange = (field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      storeInfo: {
        ...prev.storeInfo,
        [field]: value
      }
    }))
  }

  const handleTaxSettingChange = (field: string, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      taxSettings: {
        ...prev.taxSettings,
        [field]: value
      }
    }))
  }

  const handleBusinessRuleChange = (field: string, value: string | number | boolean) => {
    setConfig(prev => ({
      ...prev,
      businessRules: {
        ...prev.businessRules,
        [field]: value
      }
    }))
  }

  const handleReceiptSettingChange = (field: string, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      receiptSettings: {
        ...prev.receiptSettings,
        [field]: value
      }
    }))
  }

  const saveConfiguration = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('systemConfiguration', JSON.stringify(config))
      setSuccessMessage("Configuration saved successfully!")
      setLoading(false)
      setTimeout(() => setSuccessMessage(""), 3000)
    }, 1000)
  }

  const tabs = [
    { id: "store", name: "Store Information", icon: "🏪" },
    { id: "tax", name: "Tax Settings", icon: "💰" },
    { id: "business", name: "Business Rules", icon: "📋" },
    { id: "receipt", name: "Receipt Settings", icon: "🧾" }
  ]

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Configuration</h1>
          <p className="text-gray-600">Configure store settings, tax rates, and business rules</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✅</span>
              {successMessage}
            </div>
          </div>
        )}

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏪</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Store Status</p>
                <p className="text-lg font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tax Rate</p>
                <p className="text-lg font-bold text-purple-600">{config.taxSettings.defaultTaxRate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Business Rules</p>
                <p className="text-lg font-bold text-orange-600">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-lg font-bold text-green-600">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Store Information Tab */}
            {activeTab === "store" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Store Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Store Name</label>
                        <HelpButton content="This is the official name of your business that will appear on receipts and reports" />
                      </div>
                      <input
                        type="text"
                        value={config.storeInfo.name}
                        onChange={(e) => handleStoreInfoChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Store Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={config.storeInfo.phone}
                        onChange={(e) => handleStoreInfoChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={config.storeInfo.email}
                        onChange={(e) => handleStoreInfoChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="store@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={config.storeInfo.website}
                        onChange={(e) => handleStoreInfoChange('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="www.yourstore.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={config.storeInfo.address}
                        onChange={(e) => handleStoreInfoChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={config.storeInfo.city}
                        onChange={(e) => handleStoreInfoChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Dallas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <select
                        value={config.storeInfo.state}
                        onChange={(e) => handleStoreInfoChange('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select State</option>
                        <option value="TX">Texas</option>
                        <option value="CA">California</option>
                        <option value="FL">Florida</option>
                        <option value="NY">New York</option>
                        {/* Add more states as needed */}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={config.storeInfo.zipCode}
                        onChange={(e) => handleStoreInfoChange('zipCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="75201"
                      />
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">FFL Number</label>
                        <HelpButton content="Federal Firearms License number required for gun sales. Format: 1-XX-XXX-XX-XX-XXXXX" />
                      </div>
                      <input
                        type="text"
                        value={config.storeInfo.fflNumber}
                        onChange={(e) => handleStoreInfoChange('fflNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1-12-345-67-8A-12345"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Hours</label>
                      <textarea
                        value={config.storeInfo.businessHours}
                        onChange={(e) => handleStoreInfoChange('businessHours', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mon-Fri: 9:00 AM - 7:00 PM"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tax Settings Tab */}
            {activeTab === "tax" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Default Tax Rate (%)</label>
                        <HelpButton content="Combined state and local tax rate applied to most products. Example: 8.25% = 6.25% state + 2.00% local" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={config.taxSettings.defaultTaxRate}
                        onChange={(e) => handleTaxSettingChange('defaultTaxRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="8.25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={config.taxSettings.stateTaxRate}
                        onChange={(e) => handleTaxSettingChange('stateTaxRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="6.25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Local Tax Rate (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={config.taxSettings.localTaxRate}
                        onChange={(e) => handleTaxSettingChange('localTaxRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="2.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax Reporting</label>
                      <select
                        value={config.taxSettings.taxReporting}
                        onChange={(e) => handleTaxSettingChange('taxReporting', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Tax Exempt Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {config.taxSettings.taxExemptCategories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                          <button
                            onClick={() => {
                              const newCategories = config.taxSettings.taxExemptCategories.filter((_, i) => i !== index)
                              handleTaxSettingChange('taxExemptCategories', newCategories)
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <button className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                        + Add Category
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Rules Tab */}
            {activeTab === "business" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Business Rules & Limits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount - Cashier (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={config.businessRules.maxDiscountCashier}
                        onChange={(e) => handleBusinessRuleChange('maxDiscountCashier', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount - Manager (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={config.businessRules.maxDiscountManager}
                        onChange={(e) => handleBusinessRuleChange('maxDiscountManager', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Return Policy (Days)</label>
                      <input
                        type="number"
                        value={config.businessRules.returnPolicyDays}
                        onChange={(e) => handleBusinessRuleChange('returnPolicyDays', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Manager Void Threshold ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={config.businessRules.requireManagerVoid}
                        onChange={(e) => handleBusinessRuleChange('requireManagerVoid', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Refund Without Receipt ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={config.businessRules.maxRefundWithoutReceipt}
                        onChange={(e) => handleBusinessRuleChange('maxRefundWithoutReceipt', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Policy Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.businessRules.allowNegativeInventory}
                          onChange={(e) => handleBusinessRuleChange('allowNegativeInventory', e.target.checked)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Allow Negative Inventory</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.businessRules.requireCustomerForSales}
                          onChange={(e) => handleBusinessRuleChange('requireCustomerForSales', e.target.checked)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Require Customer for All Sales</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Receipt Settings Tab */}
            {activeTab === "receipt" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Receipt Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Header Text</label>
                      <textarea
                        value={config.receiptSettings.headerText}
                        onChange={(e) => handleReceiptSettingChange('headerText', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Store name and tagline"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
                      <textarea
                        value={config.receiptSettings.footerText}
                        onChange={(e) => handleReceiptSettingChange('footerText', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Thank you message"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
                      <select
                        value={config.receiptSettings.paperSize}
                        onChange={(e) => handleReceiptSettingChange('paperSize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="80mm">80mm (Standard)</option>
                        <option value="58mm">58mm (Compact)</option>
                        <option value="letter">Letter (8.5x11)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="text-md font-medium text-gray-900">Print Options</h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.receiptSettings.showLogo}
                        onChange={(e) => handleReceiptSettingChange('showLogo', e.target.checked)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Show Store Logo on Receipt</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.receiptSettings.printCustomerCopy}
                        onChange={(e) => handleReceiptSettingChange('printCustomerCopy', e.target.checked)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Print Customer Copy</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.receiptSettings.printMerchantCopy}
                        onChange={(e) => handleReceiptSettingChange('printMerchantCopy', e.target.checked)}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Print Merchant Copy</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={saveConfiguration}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="mr-2">💾</span>
                Save Configuration
              </>
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <QuickActions user={user} onActionComplete={(action) => {
            setSuccessMessage(`Quick action "${action}" completed successfully!`)
            setTimeout(() => setSuccessMessage(""), 3000)
          }} />
        </div>

        {/* System Alerts */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent System Alerts</h3>
          <div className="space-y-3">
            {mockSystemAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.type === 'error' ? 'bg-red-50 border-red-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  alert.type === 'success' ? 'bg-green-50 border-green-200' :
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-lg mr-3">
                    {alert.type === 'error' ? '❌' : 
                     alert.type === 'warning' ? '⚠️' :
                     alert.type === 'success' ? '✅' : 'ℹ️'}
                  </span>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      alert.type === 'error' ? 'text-red-900' :
                      alert.type === 'warning' ? 'text-yellow-900' :
                      alert.type === 'success' ? 'text-green-900' :
                      'text-blue-900'
                    }`}>
                      {alert.title}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      alert.type === 'error' ? 'text-red-700' :
                      alert.type === 'warning' ? 'text-yellow-700' :
                      alert.type === 'success' ? 'text-green-700' :
                      'text-blue-700'
                    }`}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
