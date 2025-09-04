"use client"

import { useState } from "react"
import { User } from "@/utils/auth"
import { mockFileManagement, FileManagementData } from "@/data/phase2MockData"

interface FileManagementProps {
  user: User;
}

export default function FileManagement({ user }: FileManagementProps) {
  const [fileData, setFileData] = useState<FileManagementData>(mockFileManagement)
  const [activeTab, setActiveTab] = useState("images")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const saveConfiguration = () => {
    setLoading(true)
    // Simulate API call to save file management settings
    setTimeout(() => {
      localStorage.setItem('fileManagementSettings', JSON.stringify(fileData))
      setSuccessMessage("File management settings saved successfully!")
      setLoading(false)
      setTimeout(() => setSuccessMessage(""), 3000)
    }, 1000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const downloadTemplate = (templateId: number) => {
    const template = fileData.importTemplates.find(t => t.id === templateId)
    if (template) {
      // Simulate download
      alert(`Downloading ${template.name}...`)
    }
  }

  const downloadBackup = (backupId: number) => {
    const backup = fileData.recentBackups.find(b => b.id === backupId)
    if (backup) {
      alert(`Downloading backup from ${new Date(backup.date).toLocaleDateString()}...`)
    }
  }

  const createManualBackup = () => {
    alert("Creating manual backup... This may take a few minutes.")
  }

  const tabs = [
    { id: "images", name: "Product Images", icon: "🖼️" },
    { id: "import", name: "Data Import/Export", icon: "📊" },
    { id: "backup", name: "Backup Management", icon: "💾" },
    { id: "documents", name: "Documents", icon: "📄" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100'
      case 'failed': case 'error': return 'text-red-600 bg-red-100'
      case 'partial': case 'processing': return 'text-yellow-600 bg-yellow-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'failed': case 'error': return '❌'
      case 'partial': return '⚠️'
      case 'processing': case 'in-progress': return '🔄'
      default: return '📄'
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">File Management Center</h1>
          <p className="text-gray-600">Manage product images, import/export data, and system backups</p>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🖼️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Product Images</p>
                <p className="text-2xl font-bold text-purple-600">{fileData.productImages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Import Templates</p>
                <p className="text-2xl font-bold text-blue-600">{fileData.importTemplates.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💾</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Backups</p>
                <p className="text-2xl font-bold text-green-600">{fileData.recentBackups.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Storage</p>
                <p className="text-2xl font-bold text-orange-600">125 MB</p>
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
            {/* Product Images Tab */}
            {activeTab === "images" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Product Images</h3>
                  <div className="flex space-x-3">
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      <span className="mr-2">📤</span>
                      Upload Images
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <span className="mr-2">🗂️</span>
                      Organize
                    </button>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Uploading...</span>
                      <span className="text-sm text-blue-700">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {fileData.productImages.map((image) => (
                    <div key={image.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl">🖼️</span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 truncate">{image.name}</h4>
                        <p className="text-sm text-gray-600">{image.category}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-gray-500">{image.size}</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(image.status)}`}>
                            {getStatusIcon(image.status)} {image.status}
                          </span>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button className="flex-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                            View
                          </button>
                          <button className="flex-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Import/Export Tab */}
            {activeTab === "import" && (
              <div className="space-y-8">
                {/* Import Templates */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Import Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fileData.importTemplates.map((template) => (
                      <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <div className="flex items-center mt-3 space-x-4">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {template.format}
                              </span>
                              <span className="text-xs text-gray-500">
                                Updated: {new Date(template.lastUpdated).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => downloadTemplate(template.id)}
                            className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Imports */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Imports</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              File Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Records
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {fileData.recentImports.map((importRecord) => (
                            <tr key={importRecord.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{importRecord.fileName}</div>
                                {importRecord.errors && (
                                  <div className="text-xs text-red-600 mt-1">
                                    {importRecord.errors.length} errors
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                  {importRecord.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {importRecord.recordsProcessed.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(importRecord.status)}`}>
                                  {getStatusIcon(importRecord.status)} {importRecord.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(importRecord.date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Import Actions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-3">Import Data</h4>
                  <div className="flex flex-wrap gap-3">
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      📦 Import Products
                      <input type="file" accept=".csv,.xlsx" className="hidden" />
                    </label>
                    <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
                      👥 Import Customers
                      <input type="file" accept=".csv,.xlsx" className="hidden" />
                    </label>
                    <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors">
                      📊 Import Inventory
                      <input type="file" accept=".csv,.xlsx" className="hidden" />
                    </label>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      📤 Export Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Management Tab */}
            {activeTab === "backup" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Backup Management</h3>
                  <button
                    onClick={createManualBackup}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <span className="mr-2">💾</span>
                    Create Manual Backup
                  </button>
                </div>

                {/* Backup Schedule Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 mb-3">Automatic Backup Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-green-800">Frequency:</span>
                      <span className="ml-2 text-sm text-green-700">Daily at 2:00 AM</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-800">Retention:</span>
                      <span className="ml-2 text-sm text-green-700">30 days</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-800">Next Backup:</span>
                      <span className="ml-2 text-sm text-green-700">Tonight at 2:00 AM</span>
                    </div>
                  </div>
                </div>

                {/* Recent Backups Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Recent Backups</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fileData.recentBackups.map((backup) => (
                          <tr key={backup.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(backup.date).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {backup.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                backup.type === 'automatic' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {backup.type === 'automatic' ? '🤖' : '👤'} {backup.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                                {getStatusIcon(backup.status)} {backup.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              {backup.status === 'success' && (
                                <button
                                  onClick={() => downloadBackup(backup.id)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                >
                                  Download
                                </button>
                              )}
                              <button className="text-red-600 hover:text-red-900 transition-colors">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Document Storage</h3>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <span className="mr-2">📤</span>
                    Upload Document
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Document Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3">📋</div>
                      <h4 className="font-medium text-gray-900 mb-2">Compliance Documents</h4>
                      <p className="text-sm text-gray-600 mb-4">ATF forms, licenses, permits</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        12 documents
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3">📚</div>
                      <h4 className="font-medium text-gray-900 mb-2">Training Materials</h4>
                      <p className="text-sm text-gray-600 mb-4">User manuals, training guides</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        8 documents
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-center">
                      <div className="text-4xl mb-3">🏪</div>
                      <h4 className="font-medium text-gray-900 mb-2">Vendor Catalogs</h4>
                      <p className="text-sm text-gray-600 mb-4">Product catalogs, price lists</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        15 documents
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Documents */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Recently Added Documents</h4>
                  <div className="space-y-3">
                    {[
                      { name: "ATF Form 4473 - Updated Version", type: "Compliance", date: "2024-01-14", size: "2.3 MB" },
                      { name: "Smith & Wesson 2024 Catalog", type: "Vendor", date: "2024-01-13", size: "15.7 MB" },
                      { name: "POS Training Manual v2.1", type: "Training", date: "2024-01-12", size: "4.2 MB" }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">📄</span>
                          <div>
                            <div className="font-medium text-gray-900">{doc.name}</div>
                            <div className="text-sm text-gray-600">{doc.type} • {doc.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{doc.date}</span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                        </div>
                      </div>
                    ))}
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
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
