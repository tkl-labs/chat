'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle,
  Search,
  Settings,
  LogOut,
  UserIcon,
  Plus,
} from 'lucide-react'
import { Group } from '@/lib/db-types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ChatSidebarSkeleton from '@/app/components/ui/skeletons'
import { getMockData } from '@/lib/mock-data'
import { useNotification } from '@/app/components/context/notification-provider'
import { AddFriendDialog } from '@/app/components/dialogs/add-friend-dialog'
import ChatsTab from '@/app/components/dashboard/left-hand-panel/tabs/chats-tab'
import FriendsTab from '@/app/components/dashboard/left-hand-panel/tabs/friends-tab'
import RequestsTab from '@/app/components/dashboard/left-hand-panel/tabs/requests-tab'
import Image from 'next/image'
import api from '@/lib/axios'
import { AxiosError } from 'axios'
import { Friend, FriendRequest } from '@/lib/db-types'

interface ProfilePayload {
  username: string
  email: string
  phone_number: string
  bio?: string
  profile_pic?: string
}

type TabType = 'chats' | 'friends' | 'requests'

export default function ChatSidebar({
  onSelect,
}: {
  onSelect: (view: 'welcome' | 'profile') => void
}) {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfilePayload>()
  const { showNotification } = useNotification()
  const [groups, setGroups] = useState<Group[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [friendsLoading, setFriendsLoading] = useState(false)
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('chats')
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(
    new Set(),
  )
  
  useEffect(() => {
    // Fetch user profile on mount
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/profile/self')
        console.log(response.data)
        setProfile(response.data)
      } catch (err) {
        const error = err as AxiosError<{ detail?: string }>
        const message =
          error.response?.data?.detail || 'Failed to load profile.'
        showNotification('error', message, 'Error')
      }
    }
    fetchUserProfile()
  }, [showNotification])

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Use the same mock data as the chat page
        const mockData = await getMockData()

        // Transform DM group names to show only the other person's name
        const transformedGroups = mockData.groups.map((group) => {
          if (group.is_dm) {
            // Extract just the other person's name from "Koushic Sumathi Kumar & Other Name"
            const nameParts = group.name.split(' & ')
            const otherPersonName = nameParts[1] || nameParts[0]
            return {
              ...group,
              name: otherPersonName,
            }
          }
          return group
        })

        setGroups(transformedGroups)
      } catch (error) {
        console.log('Error fetching groups:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGroups()
  }, [])

  const fetchFriends = async () => {
    if (friends.length > 0) return // Don't fetch if already loaded

    setFriendsLoading(true)
    try {
      const response = await api.get('/friend/all')
      setFriends(response.data)
      console.log('Friends fetched:', response.data)
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>
      const message = error.response?.data?.detail || 'Failed to load friends.'
      showNotification('error', message, 'Error')
    } finally {
      setFriendsLoading(false)
    }
  }

  const fetchFriendRequests = async () => {
    if (friendRequests.length > 0) return // Don't fetch if already loaded

    setRequestsLoading(true)
    try {
      const response = await api.get('/friend/requests')

      // Parse the JSON string into a real array
      const parsedData = JSON.parse(response.data)

      setFriendRequests(parsedData)
      console.log('Friend requests fetched:', parsedData)
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>
      const message =
        error.response?.data?.detail || 'Failed to load friend requests.'
      showNotification('error', message, 'Error')
    } finally {
      setRequestsLoading(false)
    }
  }

  const handleFriendRequestAction = async (
    requesting_user_id: string,
    action: 'accept' | 'reject',
  ) => {
    setProcessingRequests((prev) => new Set([...prev, requesting_user_id]))

    try {
      const accept = action === 'accept'
      const response = await api.patch('/friend/add', {
        requesting_user_id: requesting_user_id,
        accept: accept,
      })

      console.log(`Friend request ${action}ed:`, response.data)
      setFriendRequests((prev) =>
        prev.filter((req) => req.id !== requesting_user_id),
      )

      // If accepted, refresh friends list
      if (action === 'accept') {
        setFriends([])
        if (activeTab === 'friends') {
          fetchFriends()
        }
      }

      const actionText = action === 'accept' ? 'accepted' : 'rejected'
      showNotification('success', `Friend request ${actionText}`, 'Success')
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>
      const message = error.response?.data?.detail || `Failed to ${action} friend request.`
      showNotification('error', message, 'Error')
    } finally {
      setProcessingRequests((prev) => {
        const newSet = new Set(prev)
        newSet.delete(requesting_user_id)
        return newSet
      })
    }
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === 'friends') {
      fetchFriends()
    } else if (tab === 'requests') {
      fetchFriendRequests()
    }
  }

  const handleLogOut = async () => {
    try {
      const response = await api.post('/auth/logout')

      // Testing User UX
      setTimeout(() => {
        router.push('/login')
      }, 500)
      showNotification('success', response.data?.detail, 'Goodbye!')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chats':
        return <ChatsTab groups={groups} searchTerm={searchTerm} />
      case 'friends':
        return (
          <FriendsTab
            friends={friends}
            searchTerm={searchTerm}
            loading={friendsLoading}
          />
        )
      case 'requests':
        return (
          <RequestsTab
            requests={friendRequests}
            searchTerm={searchTerm}
            loading={requestsLoading}
            processingRequests={processingRequests}
            onRequestAction={handleFriendRequestAction}
          />
        )
      default:
        return null
    }
  }

  if (loading) {
    return <ChatSidebarSkeleton />
  }

  return (
    <>
      <div className="w-screen sm:w-2xs h-screen flex flex-col border-r border-[var(--border-color)]">
        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-[var(--foreground)]" />
              <h1 className="text-xl font-bold">TKL Chat</h1>
            </div>
            <button
              onClick={() => setIsAddFriendOpen(true)}
              className="p-2 rounded-md hover:bg-[var(--hover-light)] 
              dark:hover:bg-[var(--hover-dark-mode)] transition-colors"
              aria-label="Add friend"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-2">
          <div className="flex bg-[var(--hover-light)] dark:bg-[var(--hover-dark-mode)] rounded-md p-1">
            <button
              onClick={() => handleTabChange('chats')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'chats'
                  ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => handleTabChange('friends')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'friends'
                  ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => handleTabChange('requests')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
                activeTab === 'requests'
                  ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Requests
              {friendRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--error-color)] text-white text-xs rounded-full flex items-center justify-center">
                  {friendRequests.length}
                </span>
              )}
            </button>
          </div>
          <div className="relative mt-3">
            <Search
              className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 
            text-[var(--muted-foreground)]"
            />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-[var(--border-color)] rounded-md
            bg-transparent text-sm focus: outline-none focus:ring-1 focus:ring-[var(--foreground)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">{renderTabContent()}</div>

        <div className="p-2 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onSelect('profile')}
              className="flex flex-1 min-w-0 items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--hover-light)]
             dark:hover:bg-[var(--hover-dark-mode)] transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[var(--user-loading-color)] flex items-center justify-center">
                  {profile?.profile_pic ? (
                    <Image
                      src={profile.profile_pic}
                      alt={profile.username || 'User Profile'}
                      className="w-full h-full rounded-full"
                      width={760}
                      height={760}
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              <div className="truncate">{profile?.username}</div>
            </button>

            <div className="flex">
              <Link
                href="/settings"
                className="p-3 rounded-md hover:bg-[var(--hover-light)]
             dark:hover:bg-[var(--hover-dark-mode)] transition-colors"
              >
                <Settings className="w-6 h-6" />
              </Link>

              <button
                onClick={handleLogOut}
                className="p-3 rounded-md hover:bg-[var(--hover-light)]
             dark:hover:bg-[var(--hover-dark-mode)] transition-colors cursor-pointer"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddFriendDialog
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
      />
    </>
  )
}
