'use client'
import React, { useState } from 'react'
import ChatSidebar from '@/app/components/dashboard/left-hand-panel/chat-sidebar'
import WelcomeScreen from '@/app/components/dashboard/right-hand-panel/welcome'
import WebSocketClient from '@/app/web-socket/web-socket'

export default function DashboardLayout() {
  const [activeView, setActiveView] = useState<'welcome' | 'profile'>('welcome')

  const renderContent = () => {
    switch (activeView) {
      case 'welcome':
      default:
        return <WelcomeScreen />
    }
  }

  return (
    <div className="flex h-screen">
      {/* <WebSocketClient /> */}
      <ChatSidebar onSelect={(view) => setActiveView(view)} />
      <main className="flex-1 overflow-hidden hidden sm:block">
        {renderContent()}
      </main>
    </div>
  )
}
