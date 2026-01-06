
import React from 'react';

export const QuantumBanner = () => {
    return (
        <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white p-3 text-center shadow-md border-b border-purple-500/30">
            <p className="text-sm md:text-base font-medium flex justify-center items-center gap-2">
                <span className="bg-purple-600/80 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Secured</span>
                Protected by <span className="font-bold text-teal-300">Crystals-Dilithium</span> Quantum-Resistant Cryptography
            </p>
        </div>
    );
};
