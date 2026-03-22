import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 pt-16 lg:pt-6 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
