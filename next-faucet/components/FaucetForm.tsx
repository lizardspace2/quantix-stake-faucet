
"use client";


import React, { useState } from 'react';
import { InfoTooltip } from './InfoTooltip';

export const FaucetForm = () => {

    const [address, setAddress] = useState('');
    const [ip, setIp] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', message: 'Verifying node status and claiming QUANTIX...' });
        console.log('Submitting claim:', { address, nodeIp: ip });

        try {
            const res = await fetch('/api/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, nodeIp: ip })
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus({ type: 'error', message: data.error || 'Claim failed' });
            } else {
                setStatus({ type: 'success', message: `${data.message} TxID: ${data.txId}` });
                // Optional: Clear form or disable
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error occurred' });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="glass-card w-full p-8 md:p-12 rounded-[2rem] space-y-10 relative overflow-hidden group">
            {/* Inner Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors duration-1000" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-1000" />

            <div className="text-center space-y-4 relative z-10">
                <h1 className="text-4xl font-black text-white tracking-tight">
                    Claim <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-purple-400 glow-text">QUANTIX</span>
                </h1>
                <div className="flex flex-col items-center gap-3">
                    <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">
                        Validate your node status to receive the protocol-allocated reward.
                    </p>
                    <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-teal-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Limit: 5 QTX / Month
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-3">
                    <label htmlFor="address" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex justify-between items-center">
                        Receiver Address
                        <span className="text-teal-500/50 font-mono lower-case">qtx_address</span>
                    </label>
                    <div className="relative group/input">
                        <input
                            id="address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Naiv..."
                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-slate-700 outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all font-mono text-base backdrop-blur-sm"
                            required
                        />
                        <div className="absolute inset-0 rounded-2xl border border-teal-500/0 group-focus-within/input:border-teal-500/30 transition-all pointer-events-none" />
                    </div>
                </div>


                <div className="space-y-3">
                    <label htmlFor="ip" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            Node IP:Port
                            <InfoTooltip content="Your node must be synchronized with the network to receive QUANTIX. We verify your block height before sending." />
                        </span>
                        <span className="text-purple-500/50 font-mono lower-case">ipv4:port</span>
                    </label>
                    <div className="relative group/input">
                        <input
                            id="ip"
                            type="text"

                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                            placeholder="127.0.0.1:6001"
                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-slate-700 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all font-mono text-base backdrop-blur-sm"
                            required
                        />
                        <div className="absolute inset-0 rounded-2xl border border-purple-500/0 group-focus-within/input:border-purple-500/30 transition-all pointer-events-none" />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="group/btn relative w-full h-16 bg-white text-slate-950 font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] text-sm uppercase tracking-[0.2em] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-emerald-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-3">
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : 'Request Rewards'}
                        </span>
                    </button>
                </div>
            </form>

            {status && (
                <div className={`p-5 rounded-2xl border text-xs font-bold tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-500 ${status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    status.type === 'success' ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' :
                        'bg-slate-500/10 border-slate-500/20 text-slate-400'
                    }`}>
                    <div className="flex items-start gap-3">
                        {status.type === 'error' && <span className="text-lg">✕</span>}
                        {status.type === 'success' && <span className="text-lg">✓</span>}
                        <p className="leading-relaxed">{status.message}</p>
                    </div>
                </div>
            )}
        </div>
    );

};
