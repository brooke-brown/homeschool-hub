import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const gradeOptions = [
  'Pre-K', 'Kindergarten',
  '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade',
  '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade',
];

const subjectOptions = [
  'Math', 'Science', 'English', 'History', 'Art', 'Music',
  'Foreign Languages', 'Physical Education', 'Computer Science', 'Reading', 'Writing', 'Social Studies',
];

export default function StepChildForm({ index, total, child, setChild, onNext, onBack }) {
  const isValid = child.name && child.age && child.grade && child.subjects?.length > 0;

  const toggleSubject = (subject) => {
    const current = child.subjects || [];
    if (current.includes(subject)) {
      setChild({ ...child, subjects: current.filter(s => s !== subject) });
    } else {
      setChild({ ...child, subjects: [...current, subject] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-primary bg-accent px-2.5 py-1 rounded-full">
            Child {index + 1} of {total}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Tell us about your child</h2>
        <p className="text-muted-foreground mt-1">This helps us find the best matches.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            placeholder="First name"
            value={child.name || ''}
            onChange={(e) => setChild({ ...child, name: e.target.value })}
            className="mt-1.5 h-11 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Age</Label>
            <Input
              type="number"
              min={3}
              max={18}
              placeholder="Age"
              value={child.age || ''}
              onChange={(e) => setChild({ ...child, age: parseInt(e.target.value) || '' })}
              className="mt-1.5 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label>Grade</Label>
            <Select value={child.grade || ''} onValueChange={(v) => setChild({ ...child, grade: v })}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Subjects of Interest</Label>
          <p className="text-xs text-muted-foreground mb-2">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {subjectOptions.map(subject => (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                  (child.subjects || []).includes(subject)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {subject}
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
          {index < total - 1 ? 'Next Child' : 'Finish Setup'}
        </Button>
      </div>
    </div>
  );
}
