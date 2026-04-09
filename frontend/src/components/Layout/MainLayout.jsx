import React from 'react'
import Sidebar from './Sidebar.jsx'
import TopBar from './TopBar.jsx'

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif", background: '#f4f6fa' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto min-w-0">

          {children}
        </main>
      </div>
    </div>
  )
}