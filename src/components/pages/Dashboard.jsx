import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import StatsRow from '@/components/dashboard/StatsRow';
import PendingRequests from '@/components/dashboard/PendingRequests';
import UpcomingSessions from '@/components/dashboard/UpcomingSessions';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      const me = await base44.auth.me();
      setUser(me);
      if (!me.onboarding_complete) {
        navigate('/onboarding');
        return;
      }
      setLoading(false);
    };
    checkOnboarding();
  }, [navigate]);

  const { data: connections = [] } = useQuery({
    queryKey: ['connections'],
    queryFn: () => base44.entities.Connection.list(),
    enabled: !loading,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => base44.entities.StudySession.list(),
    enabled: !loading,
  });

  const { data: children = [] } = useQuery({
    queryKey: ['children'],
    queryFn: () => base44.entities.Child.filter({ parent_email: user?.email }),
    enabled: !loading && !!user,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const acceptedConnections = connections.filter(c => c.status === 'accepted');
  const pendingIncoming = connections.filter(c => c.status === 'pending' && c.receiver_email === user?.email);

  return (
    <div className="space-y-6">
      <WelcomeCard user={user} />
      <StatsRow
        connectionCount={acceptedConnections.length}
        sessionCount={sessions.length}
        childCount={children.length}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <PendingRequests
          requests={pendingIncoming}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ['connections'] })}
        />
        <UpcomingSessions sessions={sessions} />
      </div>
    </div>
  );
}
