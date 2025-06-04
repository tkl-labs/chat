'use client'

import { MessageCircle } from 'lucide-react'

export default function ChatSidebarSkeleton() {
  return (
    <div className="w-screen sm:w-64 h-screen flex flex-col border-r border-[var(--border-color)]">
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-[var(--foreground)] opacity-70" />
            <h1 className="text-xl font-bold opacity-70">TKL Chat</h1>
          </div>
          <div className="sm:hidden w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse mx-1"></div>
        </div>
      </div>

      <div className="p-2">
        <div className="relative">
          <div className="w-full h-10 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <div className="px-2 py-1 w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>

          {[...Array(5)].map((_, index) => (
            <div
              key={`group-${index}`}
              className="flex items-center gap-2 px-2 py-2 rounded-md"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          ))}

          <div className="px-2 py-1 w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4 mb-2"></div>

          {[...Array(5)].map((_, index) => (
            <div
              key={`dm-${index}`}
              className="flex items-center gap-2 px-2 py-2 rounded-md"
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2">
        <div className="sm:hidden w-full h-10 rounded-md bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
      </div>

      <div className="p-2 border-t border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-transparent">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center"></div>
            </div>
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse w-20"></div>
          </div>

          <div className="flex gap-4 mr-2">
            <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
