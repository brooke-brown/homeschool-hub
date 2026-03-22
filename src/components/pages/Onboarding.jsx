import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import StepChildCount from '@/components/onboarding/StepChildCount';
import StepParentProfile from '@/components/onboarding/StepParentProfile';
import StepChildForm from '@/components/onboarding/StepChildForm';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = count, 1 = parent, 2+ = children
  const [childCount, setChildCount] = useState(1);
  const [parentData, setParentData] = useState({ location: '', bio: '', availability: [] });
  const [children, setChildren] = useState([{ name: '', age: '', grade: '', subjects: [] }]);
  const [saving, setSaving] = useState(false);

  // Keep children array synced with count
  const updateCount = (newCount) => {
    setChildCount(newCount);
    const newChildren = [...children];
    while (newChildren.length < newCount) {
      newChildren.push({ name: '', age: '', grade: '', subjects: [] });
    }
    setChildren(newChildren.slice(0, newCount));
  };

  const updateChild = (index, data) => {
    const updated = [...children];
    updated[index] = data;
    setChildren(updated);
  };

  const handleFinish = async () => {
    setSaving(true);
    const user = await base44.auth.me();

    // Save parent profile
    await base44.auth.updateMe({
      location: parentData.location,
      bio: parentData.bio,
      availability: parentData.availability,
      onboarding_complete: true,
    });

    // Save children
    const childRecords = children.map(c => ({
      name: c.name,
      age: c.age,
      grade: c.grade,
      subjects: c.subjects,
      parent_email: user.email,
    }));
    await base44.entities.Child.bulkCreate(childRecords);

    setSaving(false);
    navigate('/');
  };

  const totalSteps = 2 + childCount; // count + parent + N children
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Step {step + 1} of {totalSteps}
          </p>
        </div>

        {/* Steps */}
        {saving ? (
          <div className="text-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground">Setting up your family profile...</p>
          </div>
        ) : step === 0 ? (
          <StepChildCount
            count={childCount}
            setCount={updateCount}
            onNext={() => setStep(1)}
          />
        ) : step === 1 ? (
          <StepParentProfile
            data={parentData}
            setData={setParentData}
            onNext={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        ) : (
          <StepChildForm
            index={step - 2}
            total={childCount}
            child={children[step - 2]}
            setChild={(data) => updateChild(step - 2, data)}
            onNext={() => {
              if (step - 2 < childCount - 1) {
                setStep(step + 1);
              } else {
                handleFinish();
              }
            }}
            onBack={() => setStep(step - 1)}
          />
        )}
      </div>
    </div>
  );
}
