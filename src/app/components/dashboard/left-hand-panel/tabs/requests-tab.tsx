import { Check, X, MailX } from 'lucide-react'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import { UserProfileDialog } from '@/app/components/dialogs/user-profile-dialog'
import { FriendRequest } from '@/lib/db-types'
import { RequestsListSkeleton } from '@/app/components/ui/skeletons'

interface RequestsTabProps {
  requests: FriendRequest[]
  searchTerm: string
  loading: boolean
  processingRequests: Set<string>
  onRequestAction: (
    requesting_user_id: string,
    action: 'accept' | 'reject',
  ) => void
}

export default function RequestsTab({
  requests,
  searchTerm,
  loading,
  processingRequests,
  onRequestAction,
}: RequestsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [user, setUser] = useState<FriendRequest | null>(null)

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) =>
        request.username
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase()),
      ),
    [requests, searchTerm],
  )

  if (loading) {
    return <RequestsListSkeleton />
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-[var(--card-background)] rounded-md">
        <div className="p-3 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] mb-4">
          <MailX className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
          No Friend Requests
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
          You don’t have any pending friend requests right now. When someone
          sends you a request, it’ll show up here.
        </p>
      </div>
    )
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-[var(--card-background)] rounded-md">
        <div className="p-3 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] mb-4">
          <MailX className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
          No Matching Requests
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
          No friend requests match your search. Try adjusting your search term
          or check your spelling.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-1">
        <div className="px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)] uppercase">
          Friend Requests ({filteredRequests.length})
        </div>
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            onClick={() => {
              setIsDialogOpen(true)
              setUser(request)
            }}
            className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--hover-light)]
            dark:hover:bg-[var(--hover-dark-mode)] transition-colors cursor-pointer"
          >
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full bg-[var(--user1-color)] text-[var(--background)]
              flex items-center justify-center"
              >
                {request.profile_pic ? (
                  <Image
                    src={request.profile_pic}
                    alt={request.username}
                    className="w-full h-full rounded-full"
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {request.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium">{request.username}</div>
              <div className="truncate text-xs text-[var(--muted-foreground)]">
                {request.email}
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRequestAction(request.id, 'accept')
                }}
                disabled={processingRequests.has(request.id)}
                className="p-1.5 rounded-md bg-[var(--success-color)] hover:bg-[var(--success-hover-color)] text-white transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
                title="Accept request"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRequestAction(request.id, 'reject')
                }}
                disabled={processingRequests.has(request.id)}
                className="p-1.5 rounded-md bg-[var(--error-color)] hover:bg-[var(--error-hover-color)] text-white transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reject request"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {user && (
        <UserProfileDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          user={user}
          isFriend={false}
          pendingRequests={requests}
        />
      )}
    </>
  )
}
