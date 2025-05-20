"use client";

import { useState, useEffect } from "react";
import { type NotificationType } from "@/lib/notification-store";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export type NotificationProps = {
  type: NotificationType;
  title?: string;
  message: string;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  autoDissmissTimeout?: number;
  showIcon?: boolean;
};

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styleMap = {
  success: {
    container: "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]",
    icon: "text-[#059669]",
  },
  error: {
    container: "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]",
    icon: "text-[#DC2626]",
  },
  info: {
    container: "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]",
    icon: "text-[#3B82F6]",
  },
  warning: {
    container: "bg-[#FFFBEB] border-[#FEF3C7] text-[#92400E]",
    icon: "text-[#F59E0B]",
  },
};

export default function Notification({
  type,
  title,
  message,
  onDismiss,
  autoDismiss = false,
  autoDissmissTimeout = 5000,
  showIcon = true,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = iconMap[type];
  const style = styleMap[type];

  useEffect(() => {
    if (autoDismiss && isVisible) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDissmissTimeout);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, autoDissmissTimeout, isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg border ${style.container} flex items-start gap-3 animate-fadeIn`}
      role="alert"
    >
      {showIcon && (
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.icon}`} />
      )}

      <div className="flex-1">
        {title && <div className="font-medium">{title}</div>}
        <div className={title ? "text-sm mt-1" : ""}> {message}</div>
      </div>

      <button
        onClick={handleDismiss}
        className="p-1 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
