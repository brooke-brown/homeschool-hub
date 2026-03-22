import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import SessionCard from '@/components/sessions/SessionCard';
import CreateSessionDialog from '@/components/sessions/CreateSessionDialog';

export default function Sessions() {
  const [user, setUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.StudySession.list('-date'),
    enabled: !!user,
  });

  const { data: connections = [] } = useQuery({
    queryKey: ['connections'],
    queryFn: () => base44.entities.Connection.list(),
    enabled: !!user,
  });

  const connectedEmails = connections
    .filter(c => c.status === 'accepted')
    .map(c => ({
      email: c.sender_email === user?.email ? c.receiver_email : c.sender_email,
      name: c.sender_email === user?.email ? c.receiver_name : c.sender_name,
    }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Study Sessions</h1>
          <p className="text-muted-foreground text-sm mt-1">Schedule and manage learning sessions.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="rounded-xl h-10">
          <Plus className="w-4 h-4 mr-2" /> New Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No study sessions yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {sessions.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {user && (
        <CreateSessionDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
          user={user}
          connectedEmails={connectedEmails}
          onCreated={() => queryClient.invalidateQueries({ queryKey: ['sessions'] })}
        />
      )}
    </div>
  );
}
