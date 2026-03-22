import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, UserPlus, Check, Loader2 } from 'lucide-react';

export default function FamilyCard({ parent, children, connectionStatus, onConnect, connecting }) {
  const childAges = children.map(c => c.age).sort((a, b) => a - b);
  const ageRange = childAges.length > 1
    ? `${childAges[0]}–${childAges[childAges.length - 1]} years`
    : childAges.length === 1 ? `${childAges[0]} years` : '';

  const allSubjects = [...new Set(children.flatMap(c => c.subjects || []))];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{parent.full_name}</h3>
          {parent.location && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> {parent.location}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{children.length} child{children.length !== 1 ? 'ren' : ''}</p>
          {ageRange && <p className="text-xs text-muted-foreground">{ageRange}</p>}
        </div>
      </div>

      {allSubjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {allSubjects.slice(0, 5).map(s => (
            <Badge key={s} variant="secondary" className="rounded-lg text-xs font-normal">
              {s}
            </Badge>
          ))}
          {allSubjects.length > 5 && (
            <Badge variant="secondary" className="rounded-lg text-xs font-normal">
              +{allSubjects.length - 5}
            </Badge>
          )}
        </div>
      )}

      {parent.availability?.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <Clock className="w-3 h-3" />
          {parent.availability.slice(0, 2).join(', ')}
          {parent.availability.length > 2 && ` +${parent.availability.length - 2}`}
        </div>
      )}

      {connectionStatus === 'accepted' ? (
        <Button disabled variant="outline" className="w-full rounded-xl h-10">
          <Check className="w-4 h-4 mr-2 text-green-600" /> Connected
        </Button>
      ) : connectionStatus === 'pending' ? (
        <Button disabled variant="outline" className="w-full rounded-xl h-10">
          Request Pending
        </Button>
      ) : (
        <Button
          onClick={onConnect}
          className="w-full rounded-xl h-10"
          disabled={connecting}
        >
          {connecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" /> Connect
            </>
          )}
        </Button>
      )}
    </div>
  );
}
