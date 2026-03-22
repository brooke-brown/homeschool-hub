import React from 'react';
import { Sun } from 'lucide-react';

export default function WelcomeCard({ user }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="bg-gradient-to-br from-primary/10 via-accent to-primary/5 rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{greeting},</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-1">
            {user?.full_name || 'Welcome back!'}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Here's what's happening with your homeschool community.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Sun className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
