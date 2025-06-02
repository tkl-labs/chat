export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export type StoreNotifcation = {
  id: string
  type: NotificationType
  title?: string
  message: string
  createdAt: number
}

class NotificationStore {
  private readonly storageKey = 'tkl-chat-notifications'

  getNotifications(): StoreNotifcation[] {
    if (typeof window === 'undefined') return []

    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to get notifications from localStorage:', error)
      return []
    }
  }

  addNotification(
    type: NotificationType,
    message: string,
    title?: string,
  ): string {
    if (typeof window === 'undefined') return ''

    try {
      const notifications = this.getNotifications()
      const id = Date.now().toString()

      const newNotification: StoreNotifcation = {
        id,
        type,
        title,
        message,
        createdAt: Date.now(),
      }

      const updatedNotifications = [...notifications, newNotification]
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(updatedNotifications),
      )

      return id
    } catch (error) {
      console.error('Failed to add notifications to localStorage:', error)
      return ''
    }
  }

  removeNotification(id: string): void {
    if (typeof window === 'undefined') return

    try {
      const notifications = this.getNotifications()
      const updatedNotifications = notifications.filter(
        (notification) => notification.id !== id,
      )
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(updatedNotifications),
      )
    } catch (error) {
      console.error('Failed to remove notification from localStorage', error)
    }
  }

  clearNotifications(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify([]))
    } catch (error) {
      console.error('Failed to clear notification from localStorage:', error)
    }
  }

  clearOldNotifications(maxAge = 30000): void {
    if (typeof window === 'undefined') return

    try {
      const notifications = this.getNotifications()
      const now = Date.now()
      const updatedNotifications = notifications.filter(
        (notification) => now - notification.createdAt < maxAge,
      )
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(updatedNotifications),
      )
    } catch (error) {
      console.error(
        'Failed to clear old notifications from localStorage:',
        error,
      )
    }
  }
}

export const notificationStore = new NotificationStore()
