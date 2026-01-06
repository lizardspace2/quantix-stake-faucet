
import React from 'react';

export const QuantumBanner = () => {
    return (
        <div className="bg-slate-900 text-white p-3 text-center shadow-lg border-b border-purple-500/20 relative z-20">
            <p className="text-sm md:text-base font-medium flex justify-center items-center gap-3 flex-wrap">
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-200 px-2 py-0.5 rounded text-xs uppercase tracking-wider font-bold">Secured</span>
                <span className="opacity-90">Protected by <span className="font-bold text-teal-300">Crystals-Dilithium</span> Quantum-Resistant Cryptography</span>
            </p>
        </div>
    );
};
