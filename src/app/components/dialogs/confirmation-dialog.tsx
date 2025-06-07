import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/buttons'

interface ConfirmationDialogProps {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
  title: string
  description: string
  cancelText?: string
  confirmText?: string
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

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

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      onCancel()
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-1 transition-all duration-300 ease-out
        ${isAnimating ? 'backdrop-blur-sm bg-black/30' : 'backdrop-blur-none bg-black/0'}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-[var(--background)] border border-[var(--border-color)] 
            rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 ease-out
          ${
            isAnimating
              ? 'translate-y-0 opacity-100 scale-100'
              : 'translate-y-full opacity-0 scale-95'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-md dark:hover:bg-[var(--muted-bg)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6 text-[var(--muted-foreground)]" />
          </button>
        </div>
        <div className="p-6 text-sm text-[var(--foreground)]">
          {description}
        </div>
        <div className="px-6 pb-6 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  )
}
