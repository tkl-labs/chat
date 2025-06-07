import { Check, X, Clock } from 'lucide-react'
import Image from 'next/image'

interface FriendRequest {
  id: string
  username: string
  email?: string
  phone_number?: string
  bio?: string
  profile_pic?: string
}

interface RequestsTabProps {
  requests: FriendRequest[]
  searchTerm: string
  loading: boolean
  processingRequests: Set<string>
  onRequestAction: (requesting_user_id: string, action: 'accept' | 'reject') => void
}

export default function RequestsTab({ 
  requests, 
  searchTerm, 
  loading, 
  processingRequests, 
  onRequestAction 
}: RequestsTabProps) {
  const filteredRequests = requests.filter((request) =>
    request.username
      .toLocaleLowerCase()
      .includes(searchTerm.toLocaleLowerCase()),
  )
  
  if (loading) {
    return (
      <div className="text-center py-4 text-[var(--muted-foreground)]">
        Loading requests...
      </div>
    )
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-4 text-[var(--muted-foreground)]">
        No friend requests
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)] uppercase">
        Friend Requests ({filteredRequests.length})
      </div>
      {filteredRequests.map((request) => (
        <div
          key={request.id}
          className="flex items-center gap-2 px-2 py-2 rounded-md bg-[var(--hover-light)]
            dark:bg-[var(--hover-dark-mode)]"
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
                  {request.username.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate font-medium">
              {request.username}
            </div>
            <div className="truncate text-xs text-[var(--muted-foreground)]">
              {request.email}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onRequestAction(request.id, 'accept')}
              disabled={processingRequests.has(request.id)}
              className="p-1.5 rounded-md bg-[var(--success-color)] hover:bg-[var(--success-hover-color)] text-white transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              title="Accept request"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => onRequestAction(request.id, 'reject')}
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
  )
}