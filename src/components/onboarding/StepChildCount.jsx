import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, BookOpen } from 'lucide-react';

export default function StepChildCount({ count, setCount, onNext }) {
  return (
    <div className="text-center space-y-8">
      <div className="w-20 h-20 rounded-2xl bg-accent mx-auto flex items-center justify-center">
        <BookOpen className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome to Homeschool Hub!</h2>
        <p className="text-muted-foreground mt-2">
          Let's get started by setting up your family profile.
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-4">
          How many children are you homeschooling?
        </p>
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={() => setCount(Math.max(1, count - 1))}
            disabled={count <= 1}
          >
            <Minus className="w-5 h-5" />
          </Button>
          <span className="text-5xl font-bold text-primary w-16 text-center">{count}</span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={() => setCount(count + 1)}
            disabled={count >= 10}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <Button onClick={onNext} className="w-full max-w-xs rounded-xl h-12 text-base">
        Continue
      </Button>
    </div>
  );
}
