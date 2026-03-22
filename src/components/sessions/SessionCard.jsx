import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Users, Monitor, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function SessionCard({ session }) {
  const isPast = new Date(session.date) < new Date(new Date().toDateString());

  return (
    <div className={`bg-card border border-border rounded-2xl p-5 transition-shadow hover:shadow-md ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{session.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{session.subject}</p>
        </div>
        <Badge variant="secondary" className="rounded-lg text-xs">
          {session.type === 'one_on_one' ? '1-on-1' : 'Group'}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          {format(new Date(session.date), 'EEEE, MMM d, yyyy')}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {session.time} · {session.duration} min
        </div>
        <div className="flex items-center gap-2">
          {session.format === 'virtual' ? (
            <><Monitor className="w-4 h-4" /> Virtual</>
          ) : (
            <><MapPin className="w-4 h-4" /> In Person</>
          )}
        </div>
        {session.invited_emails?.length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {session.invited_emails.length} invited
          </div>
        )}
      </div>

      {session.description && (
        <p className="text-sm text-muted-foreground mt-3 border-t border-border pt-3">
          {session.description}
        </p>
      )}

      <p className="text-xs text-muted-foreground mt-3">
        By {session.creator_name}
      </p>
    </div>
  );
}
