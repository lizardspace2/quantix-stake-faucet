import { useState, useEffect, useCallback } from 'react';

export interface Claim {
  id: string;
  address: string;
  amount: number;
  timestamp: number;
  nodeIp: string;
}

const STORAGE_KEY = 'quantix_faucet_claims';
const MAX_COINS_PER_ADDRESS = 5;
const COINS_PER_CLAIM = 5;

export function useFaucetClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setClaims(JSON.parse(stored));
    }
  }, []);

  const saveClaims = useCallback((newClaims: Claim[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newClaims));
    setClaims(newClaims);
  }, []);

  const getClaimedAmount = useCallback((address: string): number => {
    return claims
      .filter(c => c.address.toLowerCase() === address.toLowerCase())
      .reduce((sum, c) => sum + c.amount, 0);
  }, [claims]);

  const canClaim = useCallback((address: string): boolean => {
    return getClaimedAmount(address) < MAX_COINS_PER_ADDRESS;
  }, [getClaimedAmount]);

  const getRemainingAmount = useCallback((address: string): number => {
    const claimed = getClaimedAmount(address);
    return Math.max(0, MAX_COINS_PER_ADDRESS - claimed);
  }, [getClaimedAmount]);

  const addClaim = useCallback((address: string, nodeIp: string): Claim | null => {
    if (!canClaim(address)) return null;

    const newClaim: Claim = {
      id: crypto.randomUUID(),
      address,
      amount: COINS_PER_CLAIM,
      timestamp: Date.now(),
      nodeIp,
    };

    saveClaims([newClaim, ...claims]);
    return newClaim;
  }, [claims, canClaim, saveClaims]);

  const recentClaims = claims.slice(0, 10);

  return {
    claims,
    recentClaims,
    addClaim,
    canClaim,
    getClaimedAmount,
    getRemainingAmount,
    maxCoins: MAX_COINS_PER_ADDRESS,
    coinsPerClaim: COINS_PER_CLAIM,
  };
}
