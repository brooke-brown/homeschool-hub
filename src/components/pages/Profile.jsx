import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, MapPin, Mail, User as UserIcon, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

const availabilityOptions = [
  'Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings',
  'Weekend Mornings', 'Weekend Afternoons', 'Weekend Evenings',
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ location: '', bio: '', availability: [] });
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(me => {
      setUser(me);
      setForm({
        location: me.location || '',
        bio: me.bio || '',
        availability: me.availability || [],
      });
    });
  }, []);

  const { data: children = [] } = useQuery({
    queryKey: ['my-children'],
    queryFn: () => base44.entities.Child.filter({ parent_email: user?.email }),
    enabled: !!user,
  });

  const toggleAvailability = (slot) => {
    const current = form.availability;
    if (current.includes(slot)) {
      setForm({ ...form, availability: current.filter(s => s !== slot) });
    } else {
      setForm({ ...form, availability: [...current, slot] });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe(form);
    toast.success('Profile updated!');
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your family information.</p>
      </div>

      {/* Parent Info */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserIcon className="w-5 h-5 text-primary" /> Parent Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground text-xs">Name</Label>
              <p className="font-medium text-foreground flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                {user.full_name}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Email</Label>
              <p className="font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {user.email}
              </p>
            </div>
          </div>

          <div>
            <Label>Location</Label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="e.g., Austin, TX"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="pl-10 h-11 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label>Bio</Label>
            <Textarea
              placeholder="Tell other families about yours..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="mt-1.5 rounded-xl resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label>Availability</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {availabilityOptions.map(slot => (
                <button
                  key={slot}
                  onClick={() => toggleAvailability(slot)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    form.availability.includes(slot)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="rounded-xl h-11">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Children */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="w-5 h-5 text-primary" /> My Children
          </CardTitle>
        </CardHeader>
        <CardContent>
          {children.length === 0 ? (
            <p className="text-sm text-muted-foreground">No children added yet.</p>
          ) : (
            <div className="space-y-3">
              {children.map(child => (
                <div key={child.id} className="bg-accent/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{child.name}</p>
                    <p className="text-sm text-muted-foreground">Age {child.age} · {child.grade}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {child.subjects?.map(s => (
                      <Badge key={s} variant="secondary" className="rounded-lg text-xs font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
