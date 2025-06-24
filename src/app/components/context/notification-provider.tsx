'use client'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface StoreNotification {
  id: string
  type: NotificationType
  message: string
  title?: string
  timestamp: number
  isAnimating?: boolean
  isExiting?: boolean
}

// Mock notification store
class NotificationStore {
  private notifications: StoreNotification[] = []

  addNotification(
    type: NotificationType,
    message: string,
    title?: string,
  ): string {
    const id = Math.random().toString(36).substr(2, 9)
    const notification: StoreNotification = {
      id,
      type,
      message,
      title,
      timestamp: Date.now(),
      isAnimating: false,
      isExiting: false,
    }
    this.notifications.push(notification)
    return id
  }

  getNotifications(): StoreNotification[] {
    return [...this.notifications]
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id)
  }

  clearNotifications(): void {
    this.notifications = []
  }

  clearOldNotifications(maxAge: number): void {
    const now = Date.now()
    this.notifications = this.notifications.filter(
      (n) => now - n.timestamp < maxAge,
    )
  }

  updateNotification(id: string, updates: Partial<StoreNotification>): void {
    const index = this.notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      this.notifications[index] = { ...this.notifications[index], ...updates }
    }
  }
}

const notificationStore = new NotificationStore()

interface NotificationProps {
  type: NotificationType
  title?: string
  message: string
  onDismiss: () => void
  showIcon?: boolean
  isAnimating?: boolean
  isExiting?: boolean
}

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  onDismiss,
  showIcon = true,
  isAnimating = false,
  isExiting = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  return (
    <div
      className={`
        relative p-4 rounded-lg border shadow-lg backdrop-blur-sm
        transform transition-all duration-300 ease-out, 
        ${getBackgroundColor()}
        ${
          isAnimating && !isExiting
            ? 'translate-x-0 opacity-100 scale-100'
            : isExiting
              ? 'translate-x-full opacity-0 scale-95'
              : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {showIcon && <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>}

        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 
                   transition-colors duration-150 -mt-1 -mr-1"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 rounded-b-lg overflow-hidden">
        <div
          className={`h-full transition-all duration-5000 ease-linear
            ${
              type === 'success'
                ? 'bg-green-500'
                : type === 'error'
                  ? 'bg-red-500'
                  : type === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
            }
            ${isAnimating ? 'w-0' : 'w-full'}
          `}
        />
      </div>
    </div>
  )
}

type NotificationContextType = {
  showNotification: (
    type: NotificationType,
    message: string,
    title?: string,
    autoDismiss?: boolean,
    autoDissmissTimeout?: number,
  ) => string
  dismissNotification: (id: string) => void
  dismissAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<StoreNotification[]>([])

  useEffect(() => {
    // Clears old notifications
    notificationStore.clearOldNotifications(30000)

    // Loads the remaining notifications
    const initialNotifications = notificationStore.getNotifications()
    setNotifications(initialNotifications)

    // Animate in existing notifications
    initialNotifications.forEach((notification) => {
      setTimeout(() => {
        notificationStore.updateNotification(notification.id, {
          isAnimating: true,
        })
        setNotifications(notificationStore.getNotifications())
      }, 100)
    })

    const interval = setInterval(() => {
      setNotifications(notificationStore.getNotifications())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const dismissNotification = useCallback((id: string) => {
    // Start exit animation
    notificationStore.updateNotification(id, { isExiting: true })
    setNotifications(notificationStore.getNotifications())

    // Remove after animation completes
    setTimeout(() => {
      notificationStore.removeNotification(id)
      setNotifications(notificationStore.getNotifications())
    }, 300)
  }, [])

  const dismissAllNotifications = useCallback(() => {
    // Start exit animation for all notifications
    const currentNotifications = notificationStore.getNotifications()
    currentNotifications.forEach((notification) => {
      notificationStore.updateNotification(notification.id, { isExiting: true })
    })
    setNotifications(notificationStore.getNotifications())

    // Clear all after animation completes
    setTimeout(() => {
      notificationStore.clearNotifications()
      setNotifications([])
    }, 300)
  }, [])

  const showNotification = useCallback(
    (
      type: NotificationType,
      message: string,
      title?: string,
      autoDismiss = true,
      autoDissmissTimeout = 5000,
    ): string => {
      const id = notificationStore.addNotification(type, message, title)
      setNotifications(notificationStore.getNotifications())

      // Start entrance animation after a brief delay
      setTimeout(() => {
        notificationStore.updateNotification(id, { isAnimating: true })
        setNotifications(notificationStore.getNotifications())
      }, 50)

      if (autoDismiss) {
        setTimeout(() => {
          dismissNotification(id)
        }, autoDissmissTimeout)
      }

      return id
    },
    [dismissNotification],
  )

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        dismissNotification,
        dismissAllNotifications,
      }}
    >
      {children}

      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              style={{
                // Stagger the entrance animations
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <Notification
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onDismiss={() => dismissNotification(notification.id)}
                showIcon={true}
                isAnimating={notification.isAnimating}
                isExiting={notification.isExiting}
              />
            </div>
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)

  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    )
  }

  return context
}
