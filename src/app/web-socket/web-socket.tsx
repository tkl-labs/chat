'use client'

import { useEffect, useState } from 'react'

export default function WebSocketClient() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const ws = new WebSocket('ws://127.0.0.1:8081')

    ws.onopen = () => {
      console.log('Connected to WebSocket server')
    }

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data)
      setMessages((prev) => [...prev, event.data])
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
    }

    ws.onclose = () => {
      console.warn('WebSocket connection closed')
    }

    return () => {
      ws.close()
    }
  }, [])

  return <></>
}
