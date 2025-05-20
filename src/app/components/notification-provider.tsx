"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import Notification from "./notification";
import { type NotificationType } from "@/lib/notification-store";
import {
  notificationStore,
  type StoreNotifcation,
} from "@/lib/notification-store";

type NotificationContextType = {
  showNotification: (
    type: NotificationType,
    message: string,
    title?: string,
    autoDismiss?: boolean,
    autoDissmissTimeout?: number
  ) => string;
  dismissNotification: (id: string) => void;
  dismissAllNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<StoreNotifcation[]>([]);

  useEffect(() => {
    // Clears old notifications
    notificationStore.clearOldNotifications(30000);

    // Loads the remanining notifications
    setNotifications(notificationStore.getNotifications());

    // Set up an interval to periodically check for new notifications
    // Change this when websockets get implemented
    const interval = setInterval(() => {
      setNotifications(notificationStore.getNotifications());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = useCallback(
    (
      type: NotificationType,
      message: string,
      title?: string,
      autoDismiss = true,
      autoDissmissTimeout = 5000
    ): string => {
      const id = notificationStore.addNotification(type, message, title);
      setNotifications(notificationStore.getNotifications());

      if (autoDismiss) {
        setTimeout(() => {
          dismissNotification(id);
        }, autoDissmissTimeout);
      }

      return id;
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    notificationStore.removeNotification(id);
    setNotifications(notificationStore.getNotifications());
  }, []);

  const dismissAllNotifications = useCallback(() => {
    notificationStore.clearNotifications();
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        dismissNotification,
        dismissAllNotifications,
      }}
    >
      {children}

      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onDismiss={() => dismissNotification(notification.id)}
            showIcon={true}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
}
