import Image from 'next/image'
import { useState } from 'react'
import { UserProfileDialog } from '@/app/components/dialogs/user-profile-dialog'

interface Friend {
  username: string
  email: string
  phone_number: string
  bio?: string
  profile_pic?: string
  is_online?: boolean
}

interface FriendsTabProps {
  friends: Friend[]
  searchTerm: string
  loading: boolean
}

export default function FriendsTab({
  friends,
  searchTerm,
  loading,
}: FriendsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredFriends = friends.filter((friend) =>
    friend.username
      .toLocaleLowerCase()
      .includes(searchTerm.toLocaleLowerCase()),
  )
  const [friend, setFriend] = useState<Friend>(filteredFriends[0])

  if (loading) {
    return (
      <div className="text-center py-4 text-[var(--muted-foreground)]">
        Loading friends...
      </div>
    )
  }

  if (filteredFriends.length === 0) {
    return (
      <div className="text-center py-4 text-[var(--muted-foreground)]">
        No friends found
      </div>
    )
  }

  return (
    <>
      <div className="space-y-1">
        <div className="px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)] uppercase">
          Friends ({filteredFriends.length})
        </div>
        {filteredFriends.map((friend) => (
          <div
            key={friend.username}
            onClick={() => {
              setIsDialogOpen(true)
              setFriend(friend)
            }}
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
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--success-color)] rounded-full border-2 border-[var(--background)]"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium">{friend.username}</div>
            </div>
          </div>
        ))}
      </div>
      <UserProfileDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={friend}
        isFriend={true}
      />
    </>
  )
}
