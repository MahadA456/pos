"use client"

import { useState } from "react"
import { Card, CardHeader } from "@/components/ui/Card"
import { InputField, SelectField, CheckboxField, Button } from "@/components/ui/FormComponents"

interface DisplayPreferencesProps {
  onSave?: (preferences: DisplaySettings) => void
}

export interface DisplaySettings {
  fontSize: 'small' | 'medium' | 'large'
  tableDensity: 'compact' | 'comfortable' | 'spacious'
  language: 'en' | 'es' | 'fr'
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12hour' | '24hour'
  currency: 'USD' | 'EUR' | 'CAD'
  showHelpTips: boolean
  autoSave: boolean
  compactNavigation: boolean
}

export default function DisplayPreferences({ onSave }: DisplayPreferencesProps) {
  const [preferences, setPreferences] = useState<DisplaySettings>({
    fontSize: 'medium',
    tableDensity: 'comfortable',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12hour',
    currency: 'USD',
    showHelpTips: true,
    autoSave: true,
    compactNavigation: false
  })

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handlePreferenceChange = <K extends keyof DisplaySettings>(
    key: K,
    value: DisplaySettings[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const savePreferences = () => {
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('displayPreferences', JSON.stringify(preferences))
      setSuccessMessage("Display preferences saved successfully!")
      setLoading(false)
      onSave?.(preferences)
      setTimeout(() => setSuccessMessage(""), 3000)
    }, 500)
  }

  const resetToDefaults = () => {
    setPreferences({
      fontSize: 'medium',
      tableDensity: 'comfortable',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12hour',
      currency: 'USD',
      showHelpTips: true,
      autoSave: true,
      compactNavigation: false
    })
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            {successMessage}
          </div>
        </div>
      )}

      {/* Display Settings */}
      <Card>
        <CardHeader 
          title="Display Settings" 
          subtitle="Customize how the interface looks and feels"
          icon="🎨"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Font Size"
            value={preferences.fontSize}
            onChange={(value) => handlePreferenceChange('fontSize', value as DisplaySettings['fontSize'])}
            options={[
              { value: 'small', label: 'Small - Compact text' },
              { value: 'medium', label: 'Medium - Standard text' },
              { value: 'large', label: 'Large - Easy to read' }
            ]}
          />

          <SelectField
            label="Table Density"
            value={preferences.tableDensity}
            onChange={(value) => handlePreferenceChange('tableDensity', value as DisplaySettings['tableDensity'])}
            options={[
              { value: 'compact', label: 'Compact - More rows visible' },
              { value: 'comfortable', label: 'Comfortable - Balanced spacing' },
              { value: 'spacious', label: 'Spacious - Extra padding' }
            ]}
          />

          <SelectField
            label="Language"
            value={preferences.language}
            onChange={(value) => handlePreferenceChange('language', value as DisplaySettings['language'])}
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' }
            ]}
          />

          <SelectField
            label="Date Format"
            value={preferences.dateFormat}
            onChange={(value) => handlePreferenceChange('dateFormat', value as DisplaySettings['dateFormat'])}
            options={[
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US Format)' },
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU Format)' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO Format)' }
            ]}
          />

          <SelectField
            label="Time Format"
            value={preferences.timeFormat}
            onChange={(value) => handlePreferenceChange('timeFormat', value as DisplaySettings['timeFormat'])}
            options={[
              { value: '12hour', label: '12-hour (AM/PM)' },
              { value: '24hour', label: '24-hour (Military)' }
            ]}
          />

          <SelectField
            label="Currency"
            value={preferences.currency}
            onChange={(value) => handlePreferenceChange('currency', value as DisplaySettings['currency'])}
            options={[
              { value: 'USD', label: 'USD - US Dollar' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'CAD', label: 'CAD - Canadian Dollar' }
            ]}
          />
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="text-md font-medium text-gray-900">Interface Options</h4>
          <div className="space-y-3">
            <CheckboxField
              label="Show Help Tips"
              checked={preferences.showHelpTips}
              onChange={(checked) => handlePreferenceChange('showHelpTips', checked)}
              helpText="Display helpful tooltips and guides throughout the interface"
            />
            <CheckboxField
              label="Auto-save Changes"
              checked={preferences.autoSave}
              onChange={(checked) => handlePreferenceChange('autoSave', checked)}
              helpText="Automatically save changes without clicking save button"
            />
            <CheckboxField
              label="Compact Navigation"
              checked={preferences.compactNavigation}
              onChange={(checked) => handlePreferenceChange('compactNavigation', checked)}
              helpText="Use smaller navigation menu to save screen space"
            />
          </div>
        </div>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader 
          title="Preview" 
          subtitle="See how your settings will look"
          icon="👁️"
        />
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Sample Text</h4>
            <p className={`text-gray-700 ${
              preferences.fontSize === 'small' ? 'text-sm' :
              preferences.fontSize === 'large' ? 'text-lg' : 'text-base'
            }`}>
              This is how text will appear with your selected font size.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Sample Table</h4>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-600">Product</th>
                  <th className="text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="text-left text-sm font-medium text-gray-600">Stock</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b border-gray-100 ${
                  preferences.tableDensity === 'compact' ? 'py-1' :
                  preferences.tableDensity === 'spacious' ? 'py-4' : 'py-2'
                }`}>
                  <td className="text-sm text-gray-900">Sample Product</td>
                  <td className="text-sm text-gray-900">$99.99</td>
                  <td className="text-sm text-gray-900">25</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Date & Time Format</h4>
            <p className="text-sm text-gray-700">
              Date: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: preferences.dateFormat.includes('MM/DD') ? '2-digit' : '2-digit',
                day: '2-digit'
              })}
            </p>
            <p className="text-sm text-gray-700">
              Time: {new Date().toLocaleTimeString('en-US', {
                hour12: preferences.timeFormat === '12hour'
              })}
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={resetToDefaults}
          variant="secondary"
          icon="🔄"
        >
          Reset to Defaults
        </Button>
        <Button
          onClick={savePreferences}
          loading={loading}
          icon="💾"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
