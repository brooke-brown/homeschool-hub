import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const subjects = [
  'Math', 'Science', 'English', 'History', 'Art', 'Music',
  'Foreign Languages', 'Physical Education', 'Computer Science', 'Reading', 'Writing', 'Social Studies',
];

export default function CreateSessionDialog({ open, onClose, user, connectedEmails, onCreated }) {
  const [form, setForm] = useState({
    title: '', subject: '', date: '', time: '', duration: 60,
    type: 'group', format: 'virtual', description: '', invited_emails: [],
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.StudySession.create({
      ...form,
      duration: parseInt(form.duration),
      creator_email: user.email,
      creator_name: user.full_name,
    });
    setSaving(false);
    onCreated();
    onClose();
    setForm({ title: '', subject: '', date: '', time: '', duration: 60, type: 'group', format: 'virtual', description: '', invited_emails: [] });
  };

  const isValid = form.title && form.subject && form.date && form.time;

  const toggleInvite = (email) => {
    const current = form.invited_emails || [];
    if (current.includes(email)) {
      setForm({ ...form, invited_emails: current.filter(e => e !== email) });
    } else {
      setForm({ ...form, invited_emails: [...current, email] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Study Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Title</Label>
            <Input
              placeholder="e.g., Math Study Group"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label>Subject</Label>
            <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Duration (min)</Label>
              <Input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="mt-1.5 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_on_one">1-on-1</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Format</Label>
              <Select value={form.format} onValueChange={(v) => setForm({ ...form, format: v })}>
                <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="local">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {connectedEmails.length > 0 && (
            <div>
              <Label>Invite Connected Families</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {connectedEmails.map(({ email, name }) => (
                  <button
                    key={email}
                    onClick={() => toggleInvite(email)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      form.invited_emails.includes(email)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Description (optional)</Label>
            <Textarea
              placeholder="What will you cover?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1.5 rounded-xl resize-none"
              rows={2}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!isValid || saving}
            className="w-full h-11 rounded-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Session'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
