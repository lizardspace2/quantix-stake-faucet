'use client';

import { useEffect, useState } from 'react';

type StatusData = {
    totalClaims: number;
    currentReward: number;
    nextReward: number;
    remainingInTier: number;
    tierName: string;
};

export const FomoStatus = () => {
    const [status, setStatus] = useState<StatusData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch('/api/status');
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        // Poll every 10 seconds to keep it fresh
        const interval = setInterval(fetchStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !status) return null;

    if (status.tierName === 'Standard') {
        return (
            <div className="w-full max-w-lg mb-8 p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-center backdrop-blur-sm">
                <p className="text-slate-400">Standard Reward Tier Active</p>
                <p className="text-xl font-bold text-teal-400">5 QUANTIX / claim</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mb-8 p-6 bg-gradient-to-r from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-2xl text-center backdrop-blur-md shadow-lg shadow-orange-900/20 animate-fade-in relative overflow-hidden group">

            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                    <h3 className="text-orange-400 font-bold tracking-wider uppercase text-sm">
                        {status.tierName} Ends Soon
                    </h3>
                </div>

                <div className="text-4xl font-black text-white mb-2 drop-shadow-md">
                    {status.currentReward} <span className="text-2xl text-orange-200/80">QUANTIX</span>
                </div>

                <p className="text-orange-100 font-medium mb-4">
                    Claim now before reward drops to <span className="text-red-300 font-bold">{status.nextReward}</span>!
                </p>

                <div className="w-full bg-slate-900/50 rounded-full h-4 overflow-hidden border border-white/5">
                    <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${Math.max(5, (status.remainingInTier / (status.remainingInTier + status.totalClaims)) * 100)}%` }}
                    // Note: Progress bar logic is tricky without max tier size hardcoded on FE. 
                    // Let's simplified: just show "Remaining" visually?
                    // Actually, let's just make it look "full" if many remaining, and empty if few.
                    // Let's hardcode the denominator based on known tiers for the visual bar:
                    // Tier 1: 10 total. Tier 2: 40 total (50-10). Tier 3: 50 total (100-50).
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                    </div>
                </div>
                <div className="flex justify-between text-xs text-orange-300/60 mt-2 font-mono">
                    <span>HURRY!</span>
                    <span>{status.remainingInTier} SPOTS LEFT</span>
                </div>
            </div>
        </div>
    );
};
