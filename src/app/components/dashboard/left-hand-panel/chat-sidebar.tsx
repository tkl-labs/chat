'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle,
  Search,
  Users,
  Settings,
  LogOut,
  UserIcon,
  Plus,
} from 'lucide-react'
import { Group } from '@/lib/db-types'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ChatSidebarSkeleton from '@/app/components/skeletons'
import { getMockData } from '@/lib/mock-data'
import { useNotification } from '@/app/components/context/notification-provider'
import { AddFriendDialog } from '@/app/components/dialogs/add-friend-dialog'
import Image from 'next/image'
import api from '@/lib/axios'
import { AxiosError } from 'axios'

interface ProfilePayload {
  username: string
  email: string
  phone_number: string
  bio?: string
  profile_pic?: string
}

interface Friend {
  username: string
  email: string
  phone_number: string
  bio?: string
  profile_pic?: string
  is_online?: boolean
}

type TabType = 'chats' | 'friends'

export default function ChatSidebar({
  onSelect,
}: {
  onSelect: (view: 'welcome' | 'profile') => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<ProfilePayload>()
  const { showNotification } = useNotification()
  const [groups, setGroups] = useState<Group[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [friendsLoading, setFriendsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('chats')

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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === 'friends') {
      fetchFriends()
    }
  }

  const filteredGroups = groups.filter((group) =>
    group.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
  )

  const filteredFriends = friends.filter((friend) =>
    friend.username
      .toLocaleLowerCase()
      .includes(searchTerm.toLocaleLowerCase()),
  )

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

  if (loading) {
    return <ChatSidebarSkeleton />
  }

  return (
    <>
      <div className="w-screen sm:w-64 h-screen flex flex-col border-r border-[var(--border-color)]">
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
          {/* Tabs */}
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

        <div className="flex-1 overflow-y-auto p-2">
          {activeTab === 'chats' ? (
            // Chats Content
            filteredGroups.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)] uppercase">
                  Groups
                </div>
                {filteredGroups
                  .filter((group) => !group.is_dm)
                  .map((group) => (
                    <Link
                      key={group.id}
                      href={`/chat/${group.id}`}
                      className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--hover-light)]
                          dark:hover:bg-[var(--hover-dark-mode)] transition-colors ${
                            pathname === `/chat/${group.id}`
                              ? 'bg-[var(--hover-light)] dark:bg-[var(--hover-dark-mode)]'
                              : ''
                          }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full bg-[var(--foreground)] text-[var(--background)]
                          flex items-center justify-center"
                      >
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="truncate">{group.name}</div>
                    </Link>
                  ))}
                <div className="px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)] uppercase mt-4">
                  Direct Messages
                </div>
                {filteredGroups
                  .filter((group) => group.is_dm)
                  .map((group) => (
                    <Link
                      key={group.id}
                      href={`/chat/${group.id}`}
                      className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--hover-light)]
                          dark:hover:bg-[var(--hover-dark-mode)] transition-colors ${
                            pathname === `/chat/${group.id}`
                              ? 'bg-[var(--hover-light)] dark:bg-[var(--hover-dark-mode)]'
                              : ''
                          }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full bg-[var(--user1-color)] text-[var(--background)]
                          flex items-center justify-center"
                      >
                        <span className="text-white text-sm font-medium">
                          {group.name.charAt(0)}
                        </span>
                      </div>
                      <div className="truncate">{group.name}</div>
                    </Link>
                  ))}
              </div>
            ) : (
              <div className="text-center py-4 text-[var(--muted-foreground)]">
                No chats found
              </div>
            )
          ) : (
            // Friends Content
            <div>
              {friendsLoading ? (
                <div className="text-center py-4 text-[var(--muted-foreground)]">
                  Loading friends...
                </div>
              ) : filteredFriends.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)] uppercase">
                    Friends ({filteredFriends.length})
                  </div>
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend.username}
                      className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--hover-light)]
                        dark:hover:bg-[var(--hover-dark-mode)] transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        <div
                          className="w-8 h-8 rounded-full bg-[var(--user1-color)] text-[var(--background)]
                          flex items-center justify-center"
                        >
                          {friend.profile_pic ? (
                            <Image
                              src={friend.profile_pic}
                              alt={friend.username}
                              className="w-full h-full rounded-full"
                              width={32}
                              height={32}
                            />
                          ) : (
                            <span className="text-white text-sm font-medium">
                              {friend.username.charAt(0)}
                            </span>
                          )}
                        </div>
                        {friend.is_online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--background)]"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">
                          {friend.username}
                        </div>
                        <div className="truncate text-xs text-[var(--muted-foreground)]">
                          {friend.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-[var(--muted-foreground)]">
                  No friends found
                </div>
              )}
            </div>
          )}
        </div>

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
              <div className="truncate flex-1">{profile?.username}</div>
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
