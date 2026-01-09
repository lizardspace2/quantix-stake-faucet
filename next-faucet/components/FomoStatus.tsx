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
            <div className="w-full max-w-xl mb-12 p-6 glass-card rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Reward Tier</p>
                        <p className="text-white font-bold">Standard Distribution</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xl font-black text-teal-400 glow-text">5.00 QTX</p>
                    <p className="text-[10px] text-slate-500 font-mono">per valid claim</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mb-12 p-8 glass-card rounded-[2rem] text-center relative overflow-hidden group border-orange-500/20 ring-orange-500/5">

            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none" />

            <div className="relative z-10 space-y-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="inline-flex items-center px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">{status.tierName} Phase</span>
                    </div>
                </div>

                <div>
                    <div className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                        {status.currentReward} <span className="text-2xl text-orange-300 transition-opacity group-hover:opacity-80">QTX</span>
                    </div>
                    <p className="text-orange-200/60 font-medium text-sm mt-3 tracking-wide">
                        Urgent: Next tier drop to <span className="text-orange-400 font-black">{status.nextReward} QTX</span>
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="w-full bg-slate-950/50 rounded-full h-2.5 overflow-hidden border border-white/5 p-0.5">
                        <div
                            className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                            style={{ width: `${Math.max(5, (status.remainingInTier / (status.remainingInTier + status.totalClaims)) * 100)}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black tracking-[0.2em] text-orange-500/50 px-1">
                        <span>NETWORK DEMAND: HIGH</span>
                        <span>{status.remainingInTier} SLOTS AVAILABLE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
