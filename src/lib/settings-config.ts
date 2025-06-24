import {
  Settings,
  Bell,
  Shield,
  Palette,
  Volume2,
  Moon,
  Sun,
  Monitor,
  User,
  Lock,
  Eye,
  Smartphone,
  Mail,
  Speaker,
  Clock,
} from 'lucide-react'

export type SettingType =
  | 'toggle'
  | 'slider'
  | 'select'
  | 'theme'
  | 'input'
  | 'button'

export interface SettingOption {
  value: string
  label: string
  icon?: any
}

export interface SettingItem {
  key: string
  label: string
  description?: string
  type: SettingType
  defaultValue: any
  options?: SettingOption[]
  min?: number
  max?: number
  step?: number
  icon?: any
  validation?: (value: any) => boolean
  action?: () => void
}

export interface SettingSection {
  id: string
  label: string
  icon: any
  settings: SettingItem[]
}

export interface SettingsConfig {
  sections: SettingSection[]
}

export const settingsConfig: SettingsConfig = {
  sections: [
    {
      id: 'general',
      label: 'General',
      icon: Settings,
      settings: [
        {
          key: 'soundVolume',
          label: 'Sound Volume',
          description: 'Adjust the overall sound volume',
          type: 'slider',
          defaultValue: 50,
          min: 0,
          max: 100,
          step: 1,
          icon: Volume2,
        },
        {
          key: 'timezone',
          label: 'Timezone',
          description: 'Set your local timezone',
          type: 'select',
          defaultValue: 'UTC',
          options: [
            { value: 'UTC', label: 'UTC' },
            { value: 'EST', label: 'Eastern Time' },
            { value: 'PST', label: 'Pacific Time' },
            { value: 'GMT', label: 'Greenwich Mean Time' },
            { value: 'CET', label: 'Central European Time' },
            { value: 'JST', label: 'Japan Standard Time' },
          ],
          icon: Clock,
        },
      ],
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'theme',
          defaultValue: 'system',
          options: [
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor },
          ],
        },
      ],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      settings: [
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive notifications on your device',
          type: 'toggle',
          defaultValue: true,
          icon: Smartphone,
        },
        {
          key: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Get notified via email',
          type: 'toggle',
          defaultValue: true,
          icon: Mail,
        },
        {
          key: 'soundNotifications',
          label: 'Sound Notifications',
          description: 'Play sounds for notifications',
          type: 'toggle',
          defaultValue: false,
          icon: Speaker,
        },
      ],
    },
    {
      id: 'privacy',
      label: 'Privacy & Security',
      icon: Shield,
      settings: [
        {
          key: 'showOnlineStatus',
          label: 'Show Online Status',
          description: "Let others see when you're online",
          type: 'toggle',
          defaultValue: true,
          icon: Eye,
        },
        {
          key: 'allowFriendRequests',
          label: 'Allow Friend Requests',
          description: 'Accept friend requests from other users',
          type: 'toggle',
          defaultValue: true,
          icon: User,
        },
        {
          key: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security',
          type: 'toggle',
          defaultValue: false,
          icon: Lock,
        },
      ],
    },
  ],
}

// Helper function to get default settings values
export const getDefaultSettings = (): Record<string, any> => {
  const defaults: Record<string, any> = {}

  settingsConfig.sections.forEach((section) => {
    section.settings.forEach((setting) => {
      // Handle nested objects for grouped settings
      if (setting.key.includes('.')) {
        const [parent, child] = setting.key.split('.')
        if (!defaults[parent]) {
          defaults[parent] = {}
        }
        defaults[parent][child] = setting.defaultValue
      } else {
        defaults[setting.key] = setting.defaultValue
      }
    })
  })

  return defaults
}

// Helper function to get a specific setting configuration
export const getSettingConfig = (key: string): SettingItem | undefined => {
  for (const section of settingsConfig.sections) {
    const setting = section.settings.find((s) => s.key === key)
    if (setting) return setting
  }
  return undefined
}

// Helper function to validate a setting value
export const validateSetting = (key: string, value: any): boolean => {
  const config = getSettingConfig(key)
  if (!config) return false

  if (config.validation) {
    return config.validation(value)
  }

  // Default validation based on type
  switch (config.type) {
    case 'toggle':
      return typeof value === 'boolean'
    case 'slider':
      return (
        typeof value === 'number' &&
        value >= (config.min || 0) &&
        value <= (config.max || 100)
      )
    case 'select':
    case 'theme':
      return config.options?.some((option) => option.value === value) || false
    case 'input':
      return typeof value === 'string' && value.length > 0
    default:
      return true
  }
}
