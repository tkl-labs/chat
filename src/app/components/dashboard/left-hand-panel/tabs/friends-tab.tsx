import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { UserProfileDialog } from '@/app/components/dialogs/user-profile-dialog'
import { FriendListSkeleton } from '@/app/components/ui/skeletons'
import { UserRoundX } from 'lucide-react'

interface Friend {
  id: string
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
  onFriendRemoved?: (friendId: string) => void
}

export default function FriendsTab({
  friends,
  searchTerm,
  loading,
  onFriendRemoved,
}: FriendsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [friendsList, setFriends] = useState<Friend[]>(friends)

  useEffect(() => {
    setFriends(friends)
  }, [friends])

  const filteredFriends = useMemo(
    () =>
      friendsList.filter((friend) =>
        friend.username
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()),
      ),
    [friendsList, searchTerm],
  )
  const [friend, setFriend] = useState<Friend>(filteredFriends[0])

  const handleFriendRemoved = (friendId: string) => {
    if (onFriendRemoved) {
      onFriendRemoved(friendId)
    }
  }

  if (loading) {
    return <FriendListSkeleton />
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-[var(--card-background)] rounded-md">
        <div className="p-3 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] mb-4">
          <UserRoundX className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
          No Friends Found
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
          Looks like you haven't added any friends yet. You can search for users
          and send them a friend request.
        </p>
      </div>
    )
  }

  if (filteredFriends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-[var(--card-background)] rounded-md">
        <div className="p-3 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] mb-4">
          <UserRoundX className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
          No Matching Friends
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
          We couldn't find any friends matching your search. Try adjusting your
          search term or check your spelling.
        </p>
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
                    {friend.username.charAt(0).toUpperCase()}
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
        onFriendRemoved={handleFriendRemoved}
      />
    </>
  )
}
