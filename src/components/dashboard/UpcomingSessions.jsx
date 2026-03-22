import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function UpcomingSessions({ sessions }) {
  const upcoming = sessions
    .filter(s => new Date(s.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Upcoming Sessions</h3>
        <Link to="/sessions">
          <Button variant="ghost" size="sm" className="text-primary text-xs">
            View All
          </Button>
        </Link>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming sessions scheduled.</p>
      ) : (
        <div className="space-y-3">
          {upcoming.map(session => (
            <div key={session.id} className="flex items-start gap-3 bg-accent/50 rounded-xl p-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">{session.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(session.date), 'MMM d')} · {session.time} · {session.duration}min
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
