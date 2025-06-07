import { Users } from 'lucide-react'
import { Group } from '@/lib/db-types'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface ChatsTabProps {
  groups: Group[]
  searchTerm: string
}

export default function ChatsTab({ groups, searchTerm }: ChatsTabProps) {
  const pathname = usePathname()

  const filteredGroups = groups.filter((group) =>
    group.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
  )

  if (filteredGroups.length === 0) {
    return (
      <div className="text-center py-4 text-[var(--muted-foreground)]">
        No chats found
      </div>
    )
  }

  return (
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
  )
}