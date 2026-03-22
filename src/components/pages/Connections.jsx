import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Link2, Clock, UserCheck, Loader2 } from 'lucide-react';

export default function Connections() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('all');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ['connections'],
    queryFn: () => base44.entities.Connection.list(),
    enabled: !!user,
  });

  const handleRespond = async (id, status) => {
    await base44.entities.Connection.update(id, { status });
    queryClient.invalidateQueries({ queryKey: ['connections'] });
  };

  const filtered = connections.filter(c => {
    if (tab === 'pending') return c.status === 'pending';
    if (tab === 'accepted') return c.status === 'accepted';
    return true;
  });

  const pendingCount = connections.filter(c => c.status === 'pending' && c.receiver_email === user?.email).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Connections</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your family connections.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-secondary rounded-xl">
          <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg">
            Pending {pendingCount > 0 && <Badge className="ml-1.5 h-5 w-5 p-0 flex items-center justify-center text-[10px]">{pendingCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="accepted" className="rounded-lg">Connected</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No connections here yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(conn => {
            const isIncoming = conn.receiver_email === user?.email;
            const otherName = isIncoming ? conn.sender_name : conn.receiver_name;

            return (
              <div key={conn.id} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    conn.status === 'accepted' ? 'bg-green-50' : conn.status === 'pending' ? 'bg-accent' : 'bg-red-50'
                  }`}>
                    {conn.status === 'accepted' ? (
                      <UserCheck className="w-5 h-5 text-green-600" />
                    ) : conn.status === 'pending' ? (
                      <Clock className="w-5 h-5 text-primary" />
                    ) : (
                      <X className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{otherName}</p>
                    <p className="text-xs text-muted-foreground">
                      {isIncoming ? 'Received' : 'Sent'} · {conn.status}
                    </p>
                  </div>
                </div>

                {conn.status === 'pending' && isIncoming && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="rounded-xl h-9"
                      onClick={() => handleRespond(conn.id, 'accepted')}
                    >
                      <Check className="w-4 h-4 mr-1" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl h-9"
                      onClick={() => handleRespond(conn.id, 'declined')}
                    >
                      <X className="w-4 h-4 mr-1" /> Decline
                    </Button>
                  </div>
                )}

                {conn.status === 'pending' && !isIncoming && (
                  <Badge variant="secondary" className="rounded-lg">Waiting</Badge>
                )}

                {conn.status === 'accepted' && (
                  <Badge className="bg-green-50 text-green-700 border-green-200 rounded-lg">Connected</Badge>
                )}

                {conn.status === 'declined' && (
                  <Badge variant="destructive" className="rounded-lg">Declined</Badge>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
