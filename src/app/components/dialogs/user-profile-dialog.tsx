import React, { useState, useEffect } from 'react'
import {
  User,
  X,
  MessageCircle,
  MoreVertical,
  Users,
  UserPlus,
  UserRoundCheck,
  Ban,
  Flag,
} from 'lucide-react'
import { Button } from '../ui/buttons'
import { useNotification } from '@/app/components/context/notification-provider'
import api from '@/lib/axios'
import { AxiosError } from 'axios'
import { ConfirmationDialog } from '@/app/components/dialogs/confirmation-dialog'

interface User {
  username: string
  email: string
  phone_number: string
  bio?: string
  profile_pic?: string
  is_online?: boolean
}

interface UserProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User
  isFriend: boolean
}

export const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  isOpen,
  onClose,
  user,
  isFriend,
}) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [showRemoveFriend, setshowRemoveFriend] = useState<boolean>(false)
  const [showEllipsisMenu, setShowEllipsisMenu] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { showNotification } = useNotification()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingFriendAction, setPendingFriendAction] = useState<
    null | 'remove'
  >(null)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable body scroll when dialog closes
      document.body.style.overflow = 'unset'
      setShowEllipsisMenu(false)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      // Check if click is outside ellipsis menu
      // Use "data" so DOM elements can be identified or you get an error
      if (showEllipsisMenu && !target.closest('[data-ellipsis-menu]')) {
        setShowEllipsisMenu(false)
      }

      // Check if click is outside remove friend menu
      // Use "data" so DOM elements can be identified or you get an error
      if (showRemoveFriend && !target.closest('[data-remove-friend-menu]')) {
        setshowRemoveFriend(false)
      }
    }

    if (showEllipsisMenu || showRemoveFriend) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEllipsisMenu, showRemoveFriend])

  const handleClose = () => {
    setIsAnimating(false)
    setShowEllipsisMenu(false)
    setshowRemoveFriend(false)
    // Add a small delay to allow exit animation for better UX
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleToggleFriend = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Close the remove friend dropdown first
    setshowRemoveFriend(false)

    if (isFriend) {
      setPendingFriendAction('remove')
      setShowConfirmDialog(true)
    } else {
      await addFriend()
    }
  }

  const addFriend = async () => {
    setLoading(true)
    try {
      const response = await api.post('/friend/add', {
        username: user.username,
      })
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

  const removeFriend = async () => {
    setLoading(true)
    try {
      const response = await api.post('/friend/remove', {
        username: user.username,
      })
      console.log(response)
      showNotification('success', 'Friend removed successfully!', 'Success')
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>
      const message = error.response?.data?.detail || 'Failed to remove Friend.'
      showNotification('error', message, 'Error')
    } finally {
      setLoading(false)
      setShowConfirmDialog(false)
    }
  }

  const handleMenuAction = (action: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowEllipsisMenu(false)

    console.log(`Action: ${action} for user: ${user?.username}`)

    switch (action) {
      case 'invite':
        // Handle invite to group
        showNotification('info', 'Invite to group feature coming soon!', 'Info')
        break
      case 'block':
        // Handle block user
        showNotification('info', 'Block user feature coming soon!', 'Info')
        break
      case 'report':
        // Handle report user
        showNotification('info', 'Report user feature coming soon!', 'Info')
        break
    }
  }

  const handleChatClick = () => {
    // Chat functionality to be implemented later
    console.log(`Start chat with ${user?.username}`)
    showNotification('info', 'Chat feature coming soon!', 'Info')
  }

  if (!isOpen || !user) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-out
        ${isAnimating ? 'backdrop-blur-sm bg-black/30' : 'backdrop-blur-none bg-black/0'}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white dark:bg-[var(--background)] border border-[var(--border-color)]
          rounded-lg shadow-xl w-full max-w-2xl mx-4 transform transition-all duration-300 ease-out
          ${
            isAnimating
              ? 'translate-y-0 opacity-100 scale-100'
              : 'translate-y-full opacity-0 scale-95'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-[var(--foreground)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              User Profile
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" data-remove-friend-menu>
              {isFriend ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setshowRemoveFriend(!showRemoveFriend)
                    setShowEllipsisMenu(false)
                  }}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] transition-colors"
                >
                  <UserRoundCheck className="w-6 h-6 text-green-600" />
                </button>
              ) : (
                <button
                  onClick={handleToggleFriend}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] transition-colors"
                  disabled={loading}
                >
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </button>
              )}

              {showRemoveFriend && (
                <div
                  className="absolute right-0 top-full mt-1 bg-white dark:bg-[var(--background)] 
                             border dark:border-[var(--border-color)] rounded-lg shadow-lg 
                             min-w-[160px] z-[60] py-1"
                >
                  <button
                    onClick={handleToggleFriend}
                    disabled={loading}
                    className="w-full px-4 py-2 text-left text-sm text-[var(--foreground)] 
                               hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] 
                               flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Users className="w-4 h-4" />
                    {loading ? 'Removing...' : 'Remove Friend'}
                  </button>
                </div>
              )}
            </div>

            <div className="relative" data-ellipsis-menu>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowEllipsisMenu(!showEllipsisMenu)
                  setshowRemoveFriend(false)
                }}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-6 h-6 text-[var(--muted-foreground)]" />
              </button>

              {showEllipsisMenu && (
                <div
                  className="absolute right-0 top-full mt-1 bg-white dark:bg-[var(--background)] 
                             border dark:border-[var(--border-color)] rounded-lg shadow-lg 
                             min-w-[160px] z-[60] py-1"
                >
                  <button
                    onClick={(e) => handleMenuAction('invite', e)}
                    className="w-full px-4 py-2 text-left text-sm text-[var(--foreground)] 
                               hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] 
                               flex items-center gap-2 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    Invite to Group
                  </button>
                  <div className="border-t dark:border-[var(--border-color)] my-1"></div>
                  <button
                    onClick={(e) => handleMenuAction('block', e)}
                    className="w-full px-4 py-2 text-left text-sm text-[var(--error-hover-color)] 
                               hover:bg-red-50 dark:hover:bg-red-900/20 
                               flex items-center gap-2 transition-colors"
                  >
                    <Ban className="w-4 h-4" />
                    Block
                  </button>
                  <button
                    onClick={(e) => handleMenuAction('report', e)}
                    className="w-full px-4 py-2 text-left text-sm text-[var(--error-hover-color)] 
                               hover:bg-red-50 dark:hover:bg-red-900/20 
                               flex items-center gap-2 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    Report User
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleClose}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-6 h-6 text-[var(--muted-foreground)]" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center justify-center md:items-start md:w-1/2">
              <div className="text-center">
                <div className="relative mb-4">
                  {user.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt={`${user.username}'s profile`}
                      className="w-32 h-32 rounded-full object-cover border-2 border-[var(--border-color)]"
                    />
                  ) : (
                    <div
                      className="w-32 h-32 rounded-full bg-gray-200 dark:bg-[var(--muted-bg)] 
                          flex items-center justify-center border-2 border-[var(--border-color)]"
                    >
                      <User className="w-16 h-16 text-[var(--muted-foreground)]" />
                    </div>
                  )}

                  {user.is_online && (
                    <div
                      className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--success-color)] 
                          rounded-full border-2 border-white dark:border-[var(--background)]"
                    ></div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {user.username}
                </h3>
                <span
                  className={`text-sm font-medium ${
                    user.is_online
                      ? 'text-green-500'
                      : 'text-[var(--muted-foreground)]'
                  }`}
                >
                  {user.is_online ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {user.email && (
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Email
                  </label>
                  <p className="text-[var(--foreground)]">{user.email}</p>
                </div>
              )}

              {user.phone_number && (
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Phone Number
                  </label>
                  <p className="text-[var(--foreground)]">
                    {user.phone_number}
                  </p>
                </div>
              )}

              {user.bio && (
                <div>
                  <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                    Bio
                  </label>
                  <p className="text-[var(--foreground)] text-sm leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {isFriend && (
            <div className="flex justify-end mt-8">
              <Button
                onClick={handleChatClick}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Chat
              </Button>
            </div>
          )}
        </div>
      </div>
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onConfirm={removeFriend}
        onCancel={() => setShowConfirmDialog(false)}
        title="Remove Friend?"
        description="Are you sure you want to remove this friend? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  )
}
