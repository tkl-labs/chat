import type React from "react";
import ChatSidebar from "../components/chat-sidebar";

export default function DashboardLayout({   
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <main className="flex-1 overflow-hidden hidden sm:block">{children}</main>
    </div>
  );
}
