import { useState, useCallback } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NodeVerification } from './NodeVerification';
import { Coins, Server } from 'lucide-react';

const claimSchema = z.object({
  address: z.string()
    .trim()
    .min(26, 'Address must be at least 26 characters')
    .max(64, 'Address must be at most 64 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Address must be alphanumeric'),
  nodeIp: z.string()
    .trim()
    .regex(/^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/, 'Must be in format IP:PORT (e.g., 1.2.3.4:6001)'),
});

interface ClaimFormProps {
  onClaim: (address: string, nodeIp: string) => boolean;
  canClaim: (address: string) => boolean;
  getRemainingAmount: (address: string) => number;
  coinsPerClaim: number;
}

export function ClaimForm({ onClaim, canClaim, getRemainingAmount, coinsPerClaim }: ClaimFormProps) {
  const [address, setAddress] = useState('');
  const [nodeIp, setNodeIp] = useState('');
  const [errors, setErrors] = useState<{ address?: string; nodeIp?: string }>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState<boolean | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);

  const validateForm = useCallback(() => {
    const result = claimSchema.safeParse({ address, nodeIp });
    if (!result.success) {
      const fieldErrors: { address?: string; nodeIp?: string } = {};
      result.error.errors.forEach(err => {
        if (err.path[0] === 'address') fieldErrors.address = err.message;
        if (err.path[0] === 'nodeIp') fieldErrors.nodeIp = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    if (!canClaim(address)) {
      setErrors({ address: 'This address has already claimed the maximum amount' });
      return false;
    }
    
    setErrors({});
    return true;
  }, [address, nodeIp, canClaim]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSuccess(false);
    setVerificationPassed(null);
    
    if (!validateForm()) return;
    
    setIsVerifying(true);
  };

  const handleVerificationComplete = useCallback((success: boolean) => {
    setIsVerifying(false);
    setVerificationPassed(success);
    
    if (success) {
      const claimed = onClaim(address, nodeIp);
      if (claimed) {
        setClaimSuccess(true);
        setAddress('');
        setNodeIp('');
      }
    }
  }, [address, nodeIp, onClaim]);

  const remaining = address ? getRemainingAmount(address) : coinsPerClaim;

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <Coins className="h-5 w-5 text-primary" />
          Request Coins
        </CardTitle>
        <CardDescription>
          Claim up to {coinsPerClaim} NaivecoinStake coins per address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center justify-between">
              <span>Receiver Address</span>
              {address && (
                <span className="text-xs text-muted-foreground">
                  Remaining: {remaining} coins
                </span>
              )}
            </Label>
            <Input
              id="address"
              placeholder="Your wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="font-mono bg-background/50"
              disabled={isVerifying}
            />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nodeIp" className="flex items-center gap-2">
              <Server className="h-3 w-3" />
              Node IP:Port
            </Label>
            <Input
              id="nodeIp"
              placeholder="1.2.3.4:6001"
              value={nodeIp}
              onChange={(e) => setNodeIp(e.target.value)}
              className="font-mono bg-background/50"
              disabled={isVerifying}
            />
            {errors.nodeIp && (
              <p className="text-sm text-destructive">{errors.nodeIp}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full font-mono"
            disabled={isVerifying || !address || !nodeIp}
          >
            {isVerifying ? 'Verifying Node...' : `Claim ${coinsPerClaim} Coins`}
          </Button>

          {claimSuccess && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-center font-mono">
              ✓ {coinsPerClaim} coins sent successfully!
            </div>
          )}
        </form>

        <NodeVerification
          nodeIp={nodeIp}
          isVerifying={isVerifying}
          onVerificationComplete={handleVerificationComplete}
        />
      </CardContent>
    </Card>
  );
}
