import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function WelcomeScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome to TKL Chat</h1>
        <p className="text-[var(--muted-foreground)] mb-6">
          Select a chat from the sidebar or start a new conversation
        </p>
        <Link
          href="/chat/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 
            bg-[var(--foreground)] text-[var(--background)] rounded-md 
            hover:bg-[var(--hover-dark)] 
            dark:hover:bg-[var(--hover-light-mode)]
            transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Start a new Chat</span>
        </Link>
      </div>
    </div>
  )
}
