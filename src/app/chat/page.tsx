'use client'

import type React from 'react'
import { useState, useEffect, useRef, use } from 'react'
import { Send, Info, Phone, Video, Search, User } from 'lucide-react'
import ChatMessage from '@/app/components/chat-message'
import { getMockData } from '@/lib/mock-data'

type Message = {
  id: string
  content: string
  timestamp: string
  senderId: string
  senderName: string
}

type GroupInfo = {
  name: string
  isGroup: boolean
  members?: number
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ groupId: string }>
}) {
  const resolvedParams = use(params)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const email = localStorage.getItem('user-email')
      if (!email) return

      try {
        const mockData = await getMockData()
        const user = mockData.users.find((u) => u.email === email)

        if (user) {
          setCurrentUserId(user.id)
        } else {
          console.warn('User not found for stored email.')
        }
      } catch (error) {
        console.error('Error fetching user from mock data:', error)
      }
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (!currentUserId) return

    const fetchChatData = async () => {
      try {
        setLoading(true)
        const mockData = await getMockData()
        const { users, groups, groupMembers, messages: allMessages } = mockData

        const currentGroup = groups.find(
          (group) => group.id === resolvedParams.groupId,
        )

        if (!currentGroup) {
          console.error(`Group with id ${resolvedParams.groupId} not found`)
          return
        }

        const currentGroupMembers = groupMembers.filter(
          (member) => member.group_id === resolvedParams.groupId,
        )

        const currentUser = users.find((u) => u.id === currentUserId)

        let displayName = currentGroup.name

        if (currentGroup.is_dm && currentUser) {
          const otherUser = users.find((u) =>
            currentGroupMembers.some(
              (m) => m.user_id === u.id && u.id !== currentUser.id,
            ),
          )
          displayName = otherUser?.username || 'Unknown'
        }

        const groupInfoData: GroupInfo = {
          name: displayName,
          isGroup: !currentGroup.is_dm,
          members: currentGroup.is_dm ? undefined : currentGroupMembers.length,
        }

        const groupMessages = allMessages
          .filter(
            (msg) => msg.group_id === resolvedParams.groupId && !msg.is_deleted,
          )
          .map((msg) => {
            const sender = users.find((user) => user.id === msg.user_id)
            const isCurrentUser = sender?.id === currentUserId

            return {
              id: msg.id,
              content: msg.content,
              timestamp: msg.created_at,
              senderId: msg.user_id,
              senderName: isCurrentUser
                ? 'You'
                : sender?.username || 'Unknown User',
            }
          })
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
          )
          .map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }))

        setGroupInfo(groupInfoData)
        setMessages(groupMessages)
      } catch (error) {
        console.error('Error fetching chat data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChatData()
  }, [currentUserId, resolvedParams.groupId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const mockData = await getMockData()
      const currentUser = mockData.users.find(
        (user) => user.id === currentUserId,
      )

      if (!currentUser) {
        console.error('Current user not found')
        return
      }

      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        senderId: currentUser.id,
        senderName: 'You',
      }

      setMessages((prev) => [...prev, newMsg])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!currentUserId || loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--foreground)]"></div>
      </div>
    )
  }

  if (!groupInfo) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)]">Group not found</p>
        </div>
      </div>
    )
  }
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${
              groupInfo.isGroup
                ? 'bg-[var(--foreground)]'
                : 'bg-[var(--user1-color)]'
            } flex items-center justify-center`}
          >
            {groupInfo.isGroup ? (
              <User className="w-5 h-5 text-[var(--background)]" />
            ) : (
              <span className="text-white text-sm font-medium">
                {groupInfo.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-semibold">{groupInfo.name}</h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              {groupInfo.isGroup ? `${groupInfo.members} members` : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-[var(--hover-light)] dark:hover:bg-[var(--hover-dark-mode)]">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--hover-light)] dark:hover:bg-[var(--hover-dark-mode)]">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--hover-light)] dark:hover:bg-[var(--hover-dark-mode)]">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--hover-light)] dark:hover:bg-[var(--hover-dark-mode)]">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[var(--muted-foreground)]">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              isCurrentUser={
                message.senderId ===
                messages.find((m) => m.senderName === 'You')?.senderId
              }
              senderName={
                message.senderName !== 'You' ? message.senderName : undefined
              }
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[var(--border-color)]">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-full focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 rounded-full bg-[var(--foreground)] text-[var(--background)] disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
