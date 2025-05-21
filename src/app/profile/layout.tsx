import type React from "react"

export default function DashboardLayout ({ children} : {children: React.ReactNode}) {
    return (
        <div className="flex h-screen">
            
            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    )
}