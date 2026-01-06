
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
        <div className="w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-6 md:p-10 rounded-2xl shadow-2xl space-y-8 ring-1 ring-white/10">
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    Claim Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">QUANTIX</span>
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                    Enter your receiver address and Active Node IP.
                    <br />
                    <span className="inline-block mt-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-300 text-xs font-semibold uppercase tracking-wider">
                        Limit: 5 QUANTIX / Month
                    </span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-bold text-slate-200 uppercase tracking-wide ml-1">
                        Receiver Address
                    </label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Naiv..."
                        className="w-full bg-slate-950 border border-slate-600 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-mono text-base shadow-inner"
                        required
                    />
                </div>


                <div className="space-y-2">
                    <label htmlFor="ip" className="text-sm font-bold text-slate-200 uppercase tracking-wide ml-1 flex items-center">
                        Node IP:Port
                        <InfoTooltip content="Your node must be synchronized with the network to receive QUANTIX. We verify your block height before sending." />
                    </label>
                    <input
                        id="ip"
                        type="text"

                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="127.0.0.1:6001"
                        className="w-full bg-slate-950 border border-slate-600 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono text-base shadow-inner"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 via-teal-600 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-teal-900/30 hover:shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] text-lg tracking-wide"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                        </span>
                    ) : 'Claim 5 QUANTIX'}
                </button>
            </form>

            {status && (
                <div className={`p-4 rounded-xl border-l-4 text-sm font-medium shadow-md animate-in fade-in slide-in-from-bottom-2 ${status.type === 'error' ? 'bg-red-950/40 border-red-500 text-red-200' :
                    status.type === 'success' ? 'bg-teal-950/40 border-teal-500 text-teal-200' :
                        'bg-slate-800 border-indigo-400 text-slate-200'
                    }`}>
                    {status.message}
                </div>
            )}
        </div>
    );

};
