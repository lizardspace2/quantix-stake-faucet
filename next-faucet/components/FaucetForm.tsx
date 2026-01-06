
"use client";

import React, { useState } from 'react';

export const FaucetForm = () => {
    const [address, setAddress] = useState('');
    const [ip, setIp] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: 'info', message: 'Verifying node status and claiming coins...' });

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
        <div className="max-w-md mx-auto bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-purple-400">
                    Claim Your Coins
                </h2>
                <p className="text-slate-400 text-sm">
                    Enter your receiver address and the IP of your Active Node.
                    <br />Limit: 5 Coins / Month
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="address" className="text-sm font-medium text-slate-300">Receiver Address</label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Naiv..."
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono text-sm"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="ip" className="text-sm font-medium text-slate-300">Node IP:Port</label>
                    <input
                        id="ip"
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="127.0.0.1:6001"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all font-mono text-sm"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-400 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-teal-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying & Sending...
                        </span>
                    ) : 'Claim 5 Coins'}
                </button>
            </form>

            {status && (
                <div className={`p-4 rounded-lg border text-sm ${status.type === 'error' ? 'bg-red-900/20 border-red-800 text-red-200' :
                        status.type === 'success' ? 'bg-teal-900/20 border-teal-800 text-teal-200' :
                            'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                    {status.message}
                </div>
            )}
        </div>
    );
};
