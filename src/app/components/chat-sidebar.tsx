"use client"

import { useState, useEffect } from "react";
import { Link, MessageCircle, Search, Users, Plus } from "lucide-react";
import { Group } from "@/lib/db-types";
import { usePathname } from "next/navigation";

export default function ChatSidebar() {
    const pathname = usePathname();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockGroups: Group[] = [
          {
            id: "1",
            name: "War Council",
            description: "GOATS",
            created_at: new Date().toISOString(),
            created_by: "user1",
            is_dm: false,
          },
          {
            id: "2",
            name: "War Council but BETTER",
            description: "GOATS SQUARED",
            created_at: new Date().toISOString(),
            created_by: "user1",
            is_dm: false,
          },
          {
            id: "3",
            name: "Lewis Rye",
            created_at: new Date().toISOString(),
            created_by: "user1",
            is_dm: true,
          },
          {
            id: "4",
            name: "Taisei Yokoshima",
            created_at: new Date().toISOString(),
            created_by: "user1",
            is_dm: true,
          },
        ];
        setGroups(mockGroups);
      } catch (error) {
        console.log("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  return (
    <div className="w-64 h-screen flex flex-col border-r border-[var(--border-color)]">
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-[var(--foreground)]" />
          <h1 className="text-xl font-bold">TKL-CHAT</h1>
        </div>
      </div>

      <div className="p-2">
        <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 
            text-[var(--muted-foreground)]"/>
            <input 
            type="text"
            placeholder="Seach chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-[var(--border-color)] rounded-md
            bg-transparent text-sm focus: outline-none focus:ring-1 focus:ring-[var(--foreground)]"
            />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
            <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--foreground)]"></div>
            </div>
        ) : filteredGroups.length > 0 ? (
            <div className="space-y-1">
                <div className="px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)] uppercase">
                    Groups
                </div>
                {filteredGroups.filter((group) => !group.is_dm).map((group) => (
                    <Link
                    key={group.id}
                    href={`/chat/${group.id}`}
                    className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--hover-light)]
                        dark:hover:bg-[var(--hover-dark-mode)] transition-colors ${ pathname === `/chat/${group.id}` ?
                        "bg-[var(--hover-light)] dark:bg-[var(--hover-dark-mode)]" : ""
                    }`}
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--foreground)] text-[var(--background)]
                        flex items cneter justify-center">
                            <Users className="w-4 h-4"/>
                        </div>
                        <div className="truncate">{group.name}</div>
                    
                    </Link>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-[var(--muted-foreground)] uppercase mt-4">
                    Direct Messages
                </div>
                {filteredGroups.filter((group) => group.is_dm).map((group) => (
                    <Link
                    key={group.id}
                    href={`/chat/${group.id}`}
                    className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[var(--hover-light)]
                        dark:hover:bg-[var(--hover-dark-mode)] transition-colors ${ pathname === `/chat/${group.id}` ?
                        "bg-[var(--hover-light)] dark:bg-[var(--hover-dark-mode)]" : ""
                    }`}
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--foreground)] text-[var(--background)]
                        flex items cneter justify-center">
                            <span className="text-white text-sm font-medium">{group.name.charAt(0)}</span>
                        </div>
                        <div className="truncate">{group.name}</div>
                    
                    </Link>
                ))}
            </div>
        ): (
            <div className="text-center py-4 text-[var(--muted-foreground)]"> No chats found</div>
        )}
      </div>
      <div className="p-2">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[var(--foreground)]
        text-[var(--background)] rounded-md hover:bg-[var(--hover-dark)] transition-colors">
            <Plus className="w-4 h-4"/>
            <span>New Chat</span>
        </button>
      </div>
    </div>
  );
}
