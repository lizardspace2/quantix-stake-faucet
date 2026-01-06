import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Wifi } from 'lucide-react';

type VerificationStep = 'idle' | 'connecting' | 'querying' | 'syncing' | 'success' | 'error';

interface NodeVerificationProps {
  nodeIp: string;
  isVerifying: boolean;
  onVerificationComplete: (success: boolean) => void;
}

const steps: { key: VerificationStep; label: string }[] = [
  { key: 'connecting', label: 'Connecting to node...' },
  { key: 'querying', label: 'Querying latest block...' },
  { key: 'syncing', label: 'Verifying sync status...' },
];

export function NodeVerification({ nodeIp, isVerifying, onVerificationComplete }: NodeVerificationProps) {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('idle');
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isVerifying) {
      setCurrentStep('idle');
      setStepIndex(0);
      return;
    }

    // Simulate verification steps
    const stepDurations = [800, 600, 500];
    let timeoutId: NodeJS.Timeout;
    
    const runStep = (index: number) => {
      if (index >= steps.length) {
        // Simulate 90% success rate
        const success = Math.random() > 0.1;
        setCurrentStep(success ? 'success' : 'error');
        onVerificationComplete(success);
        return;
      }
      
      setCurrentStep(steps[index].key);
      setStepIndex(index);
      
      timeoutId = setTimeout(() => {
        runStep(index + 1);
      }, stepDurations[index]);
    };

    runStep(0);

    return () => clearTimeout(timeoutId);
  }, [isVerifying, onVerificationComplete]);

  if (currentStep === 'idle') return null;

  return (
    <div className="mt-4 p-4 rounded-lg bg-card border border-border font-mono text-sm">
      <div className="flex items-center gap-2 text-muted-foreground mb-3">
        <Wifi className="h-4 w-4" />
        <span>Node: {nodeIp}</span>
      </div>
      
      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.key;
          const isComplete = stepIndex > idx || currentStep === 'success';
          const isFailed = currentStep === 'error' && stepIndex === idx;
          
          return (
            <div key={step.key} className="flex items-center gap-2">
              {isActive && !isFailed && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
              {isComplete && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              {isFailed && (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
              {!isActive && !isComplete && !isFailed && (
                <div className="h-4 w-4 rounded-full border border-muted" />
              )}
              <span className={isComplete ? 'text-green-500' : isFailed ? 'text-destructive' : isActive ? 'text-foreground' : 'text-muted-foreground'}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {currentStep === 'success' && (
        <div className="mt-3 pt-3 border-t border-border text-green-500">
          ✓ Node verified: synchronized within ±2 blocks
        </div>
      )}
      
      {currentStep === 'error' && (
        <div className="mt-3 pt-3 border-t border-border text-destructive">
          ✗ Verification failed: node unreachable or out of sync
        </div>
      )}
    </div>
  );
}
