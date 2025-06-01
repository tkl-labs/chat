import type React from "react";

export default function ChatPageLayout({   
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <main className="flex-1">{children}</main>
    </div>
  );
}
