import React from 'react';
import { Users, Link2, BookOpen } from 'lucide-react';

export default function StatsRow({ connectionCount, sessionCount, childCount }) {
  const stats = [
    { label: 'Connections', value: connectionCount, icon: Link2, color: 'text-primary' },
    { label: 'Sessions', value: sessionCount, icon: BookOpen, color: 'text-chart-2' },
    { label: 'Children', value: childCount, icon: Users, color: 'text-chart-4' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
          <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  );
}
