import React, { useState, useEffect } from 'react'
import { User, X, UserPlus } from 'lucide-react'
import { Button } from '../ui/buttons'
import api from '@/lib/axios'
import { AxiosError } from 'axios'
import { useNotification } from '@/app/components/context/notification-provider'

interface AddFriendDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const { showNotification } = useNotification()
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable body scroll when dialog closes
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const isValidUsername = (username: string) => {
    return /^[a-zA-Z0-9]{8,16}$/.test(username)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/friend/add', { username })
      console.log(response)
      showNotification(
        'success',
        'Friend Request sent successfully!',
        'Success',
      )
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>
      const message =
        error.response?.data?.detail || 'Failed to send Friend Request.'
      showNotification('error', message, 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsAnimating(false)
    // Add a small delay to allow exit animation for better UX
    setTimeout(() => {
      setUsername('')
      onClose()
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
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-[var(--foreground)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Add Friend
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-md dark:hover:bg-[var(--muted-bg)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-6 h-6 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-2"
            >
              Username
            </label>

            <div className="relative">
              <div
                className="absolute inset-y-0 left-0 pl-3 flex items-center
                                        pointer-events-none"
              >
                <User className="h-5 w-5 text-[var(--muted-foreground)]" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[var(--border-color)]
                      rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]
                      focus:border-transparent transition-all duration-300
                      text-[var(--foreground)] font-medium"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || !isValidUsername(username)}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>Send Request</>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
