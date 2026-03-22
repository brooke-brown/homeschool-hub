import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const subjects = [
  'Math', 'Science', 'English', 'History', 'Art', 'Music',
  'Foreign Languages', 'Physical Education', 'Computer Science', 'Reading', 'Writing', 'Social Studies',
];

const ageGroups = [
  { label: 'Ages 3–5', min: 3, max: 5 },
  { label: 'Ages 6–8', min: 6, max: 8 },
  { label: 'Ages 9–11', min: 9, max: 11 },
  { label: 'Ages 12–14', min: 12, max: 14 },
  { label: 'Ages 15–18', min: 15, max: 18 },
];

export default function FamilyFilters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or location..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="pl-10 h-11 rounded-xl"
        />
      </div>
      <Select
        value={filters.ageGroup}
        onValueChange={(v) => setFilters({ ...filters, ageGroup: v })}
      >
        <SelectTrigger className="w-40 h-11 rounded-xl">
          <SelectValue placeholder="Age Group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ages</SelectItem>
          {ageGroups.map(g => (
            <SelectItem key={g.label} value={`${g.min}-${g.max}`}>{g.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.subject}
        onValueChange={(v) => setFilters({ ...filters, subject: v })}
      >
        <SelectTrigger className="w-44 h-11 rounded-xl">
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          {subjects.map(s => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
