import { User } from "lucide-react"

type MessageProps = {
  content: string
  timestamp: string
  isCurrentUser: boolean
  senderName?: string
  senderAvatar?: string
}

export default function ChatMessage({ content, timestamp, isCurrentUser, senderName, senderAvatar }: MessageProps) {
  return (
    <div className={`flex items-start gap-2 ${isCurrentUser ? "justify-end" : ""}`}>
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--user1-color)] flex items-center justify-center flex-shrink-0 mt-1">
          {senderAvatar ? (
            <img src={senderAvatar || "/placeholder.svg"} alt={senderName} className="w-full h-full rounded-full" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
      )}

      <div
        className={`p-3 rounded-lg max-w-[80%] ${
          isCurrentUser
            ? "bg-[var(--foreground)] text-[var(--background)] rounded-tr-none"
            : "bg-[var(--muted-bg)] rounded-tl-none"
        }`}
      >
        {!isCurrentUser && senderName && <div className="text-xs font-medium mb-1">{senderName}</div>}
        <p className="text-sm">{content}</p>
        <span className={`text-xs ${isCurrentUser ? "text-[var(--background)]/70" : "text-[var(--muted-foreground)]"}`}>
          {timestamp}
        </span>
      </div>

      {isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--user2-color)] flex items-center justify-center flex-shrink-0 mt-1">
          {senderAvatar ? (
            <img src={senderAvatar || "/placeholder.svg"} alt="You" className="w-full h-full rounded-full" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
      )}
    </div>
  )
}
