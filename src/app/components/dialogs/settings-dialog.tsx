import React, { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { Button } from '../ui/buttons'
import { useNotification } from '@/app/components/context/notification-provider'
import {
  settingsConfig,
  getDefaultSettings,
  validateSetting,
  SettingItem,
} from '@/lib/settings-config'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  initialSettings?: Record<string, any>
  onSettingsChange?: (settings: Record<string, any>) => void
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  initialSettings,
  onSettingsChange,
}) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>(
    settingsConfig.sections[0]?.id || 'general',
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [settings, setSettings] = useState<Record<string, any>>(
    initialSettings || getDefaultSettings(),
  )
  const { showNotification } = useNotification()

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings)
    }
  }, [initialSettings])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Validate all settings before saving
      const isValid = Object.entries(settings).every(([key, value]) =>
        validateSetting(key, value),
      )

      if (!isValid) {
        throw new Error('Invalid settings detected')
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the callback if provided
      if (onSettingsChange) {
        onSettingsChange(settings)
      }

      showNotification('success', 'Settings saved successfully!', 'Success')
      handleClose()
    } catch (error) {
      showNotification('error', 'Failed to save settings', 'Error')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSettingAction = async (setting: SettingItem) => {
    if (setting.action) {
      try {
        setLoading(true)
        await setting.action()
        showNotification(
          'success',
          `${setting.label} completed successfully!`,
          'Success',
        )
      } catch (error) {
        showNotification('error', `Failed to execute ${setting.label}`, 'Error')
      } finally {
        setLoading(false)
      }
    }
  }

  const renderSettingControl = (setting: SettingItem) => {
    const value = settings[setting.key]
    const SettingIcon = setting.icon

    switch (setting.type) {
      case 'toggle':
        return (
          <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              {SettingIcon && (
                <SettingIcon className="w-5 h-5 text-[var(--muted-foreground)]" />
              )}
              <div>
                <div className="font-medium text-[var(--foreground)]">
                  {setting.label}
                </div>
                {setting.description && (
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {setting.description}
                  </div>
                )}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => updateSetting(setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        )

      case 'slider':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {SettingIcon && (
                <SettingIcon className="w-5 h-5 text-[var(--muted-foreground)]" />
              )}
              <div className="flex-1">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {setting.label}
                </label>
                {setting.description && (
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {setting.description}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={setting.min || 0}
                max={setting.max || 100}
                step={setting.step || 1}
                value={value || setting.defaultValue}
                onChange={(e) =>
                  updateSetting(setting.key, parseInt(e.target.value))
                }
                className="flex-1 h-2 bg-gray-200 dark:bg-[var(--muted-bg)] rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-[var(--muted-foreground)] w-12 text-right">
                {value || setting.defaultValue}
                {setting.max === 100 ? '%' : ''}
              </span>
            </div>
          </div>
        )

      case 'select':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {SettingIcon && (
                <SettingIcon className="w-5 h-5 text-[var(--muted-foreground)]" />
              )}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {setting.label}
                </label>
                {setting.description && (
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {setting.description}
                  </div>
                )}
              </div>
            </div>
            <select
              value={value || setting.defaultValue}
              onChange={(e) => updateSetting(setting.key, e.target.value)}
              className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2
            focus:ring-blue-500"
            >
              {setting.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'theme':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {SettingIcon && (
                <SettingIcon className="w-5 h-5 text-[var(--muted-foreground)]" />
              )}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {setting.label}
                </label>
                {setting.description && (
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {setting.description}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {setting.options?.map((option) => {
                const OptionIcon = option.icon
                const isSelected = value === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => updateSetting(setting.key, option.value)}
                    className={`p-3 rounded-lg border-2 transition-all
                      ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-[var(--border-color)] hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                  >
                    {OptionIcon && (
                      <OptionIcon className="w-5 h-5 mx-auto mb-2 text-[var(--foreground)]" />
                    )}
                    <div className="text-sm font-medium text-[var(--foreground)]">
                      {option.label}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 mx-auto mt-1 text-blue-500" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'input':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {SettingIcon && (
                <SettingIcon className="w-5 h-5 text-[var(--muted-foreground)]" />
              )}
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  {setting.label}
                </label>
                {setting.description && (
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {setting.description}
                  </div>
                )}
              </div>
            </div>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => updateSetting(setting.key, e.target.value)}
              className="w-full p-3 border border-[var(--border-color)] rounded-lg bg-white dark:bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${setting.label.toLowerCase()}`}
            />
          </div>
        )

      case 'button':
        return (
          <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--border-color)]">
            <div className="flex items-center gap-3">
              {SettingIcon && (
                <SettingIcon className="w-5 h-5 text-[var(--muted-foreground)]" />
              )}
              <div>
                <div className="font-medium text-[var(--foreground)]">
                  {setting.label}
                </div>
                {setting.description && (
                  <div className="text-sm text-[var(--muted-foreground)]">
                    {setting.description}
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => handleSettingAction(setting)}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {setting.label}
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-out
        ${isAnimating ? 'backdrop-blur-sm bg-black/30' : 'backdrop-blur-none bg-black/0'}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-[var(--background)] border border-[var(--border-color)]
          rounded-lg shadow-xl w-full max-w-4xl mx-4 h-[80vh] transform transition-all duration-300 ease-out
          ${
            isAnimating
              ? 'translate-y-0 opacity-100 scale-100'
              : 'translate-y-full opacity-0 scale-95'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Settings
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <div className="flex h-[calc(100%-180px)]">
          <div className="w-64 border-r dark:border-[var(--border-color)] p-4 overflow-y-auto">
            <nav className="space-y-2">
              {settingsConfig.sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${
                        activeTab === section.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-[var(--muted-foreground)] hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] hover:text-[var(--foreground)]'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {settingsConfig.sections.map((section) => {
              if (activeTab !== section.id) return null

              return (
                <div key={section.id} className="space-y-6">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {section.label}
                  </h3>

                  <div className="space-y-4">
                    {section.settings.map((setting) => (
                      <div key={setting.key}>
                        {renderSettingControl(setting)}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t dark:border-[var(--border-color)]">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
