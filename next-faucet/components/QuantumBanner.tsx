export const QuantumBanner = () => {
    return (
        <div className="bg-slate-950/40 backdrop-blur-xl text-white p-3 text-center border-b border-white/5 relative z-50">
            <p className="text-[10px] md:text-xs font-black flex justify-center items-center gap-4 flex-wrap tracking-[0.3em] uppercase">
                <span className="flex items-center gap-2 text-teal-400">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                    Protocol Secured
                </span>
                <span className="opacity-40 select-none">|</span>
                <span className="text-slate-400">
                    Quantum-Resistant Layer: <span className="text-white">Crystals-Dilithium</span>
                </span>
                <span className="opacity-40 select-none">|</span>
                <a
                    href="https://quantumresistantcoin.com"
                    className="text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 group/link"
                >
                    Main Website
                    <svg className="w-3 h-3 transform transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </p>
        </div>
    );
};
