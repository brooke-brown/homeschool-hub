import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

const availabilityOptions = [
  'Weekday Mornings',
  'Weekday Afternoons',
  'Weekday Evenings',
  'Weekend Mornings',
  'Weekend Afternoons',
  'Weekend Evenings',
];

export default function StepParentProfile({ data, setData, onNext, onBack }) {
  const isValid = data.location && data.availability?.length > 0;

  const toggleAvailability = (slot) => {
    const current = data.availability || [];
    if (current.includes(slot)) {
      setData({ ...data, availability: current.filter(s => s !== slot) });
    } else {
      setData({ ...data, availability: [...current, slot] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Your Profile</h2>
        <p className="text-muted-foreground mt-1">Help other families find you.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Location</Label>
          <div className="relative mt-1.5">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="e.g., Austin, TX"
              value={data.location || ''}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
        </div>

        <div>
          <Label>Bio (optional)</Label>
          <Textarea
            placeholder="Tell other families a bit about yours..."
            value={data.bio || ''}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
            className="mt-1.5 rounded-xl resize-none"
            rows={3}
          />
        </div>

        <div>
          <Label>Availability</Label>
          <p className="text-xs text-muted-foreground mb-2">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {availabilityOptions.map(slot => (
              <button
                key={slot}
                onClick={() => toggleAvailability(slot)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  (data.availability || []).includes(slot)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12 rounded-xl">
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="flex-1 h-12 rounded-xl">
          Continue
        </Button>
      </div>
    </div>
  );
}
