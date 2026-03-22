import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

export default function PendingRequests({ requests, onUpdate }) {
  const handleRespond = async (id, status) => {
    await base44.entities.Connection.update(id, { status });
    onUpdate();
  };

  if (requests.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-2">Connection Requests</h3>
        <p className="text-sm text-muted-foreground">No pending requests. Start connecting with families!</p>
        <Link to="/families">
          <Button variant="outline" size="sm" className="mt-3 rounded-xl">
            <UserPlus className="w-4 h-4 mr-2" />
            Find Families
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-semibold text-foreground mb-4">
        Pending Requests ({requests.length})
      </h3>
      <div className="space-y-3">
        {requests.map(req => (
          <div key={req.id} className="flex items-center justify-between bg-accent/50 rounded-xl p-3">
            <div>
              <p className="font-medium text-sm text-foreground">{req.sender_name}</p>
              {req.message && (
                <p className="text-xs text-muted-foreground mt-0.5">"{req.message}"</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-600 hover:bg-green-50"
                onClick={() => handleRespond(req.id, 'accepted')}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:bg-red-50"
                onClick={() => handleRespond(req.id, 'declined')}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
