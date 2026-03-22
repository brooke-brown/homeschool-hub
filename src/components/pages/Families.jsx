import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Users } from 'lucide-react';
import FamilyCard from '@/components/families/FamilyCard';
import FamilyFilters from '@/components/families/FamilyFilters';

export default function Families() {
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({ search: '', ageGroup: 'all', subject: 'all' });
  const [connectingId, setConnectingId] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: allUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => base44.entities.User.list(),
    enabled: !!user,
  });

  const { data: allChildren = [], isLoading: loadingChildren } = useQuery({
    queryKey: ['all-children'],
    queryFn: () => base44.entities.Child.list(),
    enabled: !!user,
  });

  const { data: connections = [] } = useQuery({
    queryKey: ['connections'],
    queryFn: () => base44.entities.Connection.list(),
    enabled: !!user,
  });

  const handleConnect = async (parentEmail, parentName) => {
    setConnectingId(parentEmail);
    await base44.entities.Connection.create({
      sender_email: user.email,
      sender_name: user.full_name,
      receiver_email: parentEmail,
      receiver_name: parentName,
      status: 'pending',
    });
    queryClient.invalidateQueries({ queryKey: ['connections'] });
    setConnectingId(null);
  };

  const getConnectionStatus = (email) => {
    const conn = connections.find(c =>
      (c.sender_email === user?.email && c.receiver_email === email) ||
      (c.receiver_email === user?.email && c.sender_email === email)
    );
    return conn?.status || null;
  };

  // Filter families
  const otherParents = allUsers.filter(u =>
    u.email !== user?.email && u.onboarding_complete
  );

  const filteredFamilies = otherParents.filter(parent => {
    const parentChildren = allChildren.filter(c => c.parent_email === parent.email);

    if (filters.search) {
      const term = filters.search.toLowerCase();
      const nameMatch = parent.full_name?.toLowerCase().includes(term);
      const locationMatch = parent.location?.toLowerCase().includes(term);
      if (!nameMatch && !locationMatch) return false;
    }

    if (filters.ageGroup !== 'all') {
      const [min, max] = filters.ageGroup.split('-').map(Number);
      const hasChildInRange = parentChildren.some(c => c.age >= min && c.age <= max);
      if (!hasChildInRange) return false;
    }

    if (filters.subject !== 'all') {
      const hasSubject = parentChildren.some(c => c.subjects?.includes(filters.subject));
      if (!hasSubject) return false;
    }

    return true;
  });

  const isLoading = loadingUsers || loadingChildren;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Find Families</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Discover homeschool families that match your interests.
        </p>
      </div>

      <FamilyFilters filters={filters} setFilters={setFilters} />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filteredFamilies.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No families match your filters yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFamilies.map(parent => (
            <FamilyCard
              key={parent.id}
              parent={parent}
              children={allChildren.filter(c => c.parent_email === parent.email)}
              connectionStatus={getConnectionStatus(parent.email)}
              onConnect={() => handleConnect(parent.email, parent.full_name)}
              connecting={connectingId === parent.email}
            />
          ))}
        </div>
      )}
    </div>
  );
}
