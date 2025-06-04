import Link from 'next/link'
import { HouseIcon, SearchXIcon } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen h-full flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center flex flex-col items-center justify-center">
        <SearchXIcon className="w-44 h-44" />
        <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-[var(--muted-foreground)] mb-6">
          This page doesn&quot;t exist. Try checking the URL or go back home.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 
            bg-[var(--foreground)] text-[var(--background)] rounded-md 
            hover:bg-[var(--hover-dark)] 
            dark:hover:bg-[var(--hover-light-mode)]
            transition-colors"
        >
          <HouseIcon className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}
