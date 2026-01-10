
import { FaucetForm } from "@/components/FaucetForm";
import { FomoStatus } from "@/components/FomoStatus";
import { Logo } from "@/components/Logo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">

      <div className="z-10 text-center mb-16 space-y-8 max-w-4xl px-4">
        <div className="relative inline-block animate-fade-in-up">
          <Logo
            className="justify-center mb-6 md:mb-10 transform scale-110 md:scale-150 transition-transform duration-700 hover:scale-125 md:hover:scale-160"
            iconClassName="h-24 w-24 md:h-32 md:w-32"
          />
        </div>

        <div className="space-y-6 animate-fade-in-up delay-100">
          <h2 className="text-4xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 tracking-tight leading-none drop-shadow-2xl">
            Node Rewards Program
          </h2>
          <p className="text-lg md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed px-4">
            Quantum-Resistant Layer 1 Infrastructure.
            <span className="block text-sm md:text-lg text-teal-400/80 mt-2 font-medium tracking-wide uppercase">
              Powered by Crystals-Dilithium
            </span>
          </p>
        </div>

        <div className="flex justify-center pt-2 md:pt-4 animate-fade-in-up delay-200">
          <div className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-slate-300 text-[10px] md:text-sm font-semibold shadow-2xl transition-all hover:bg-white/10 hover:border-white/20 group">
            <span className="relative flex h-2 w-2 md:h-3 md:w-3 mr-2 md:mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-green-500"></span>
            </span>
            <span className="group-hover:text-white transition-colors">Network: Operational</span>
          </div>
        </div>
      </div>

      <FomoStatus />

      <div className="w-full max-w-xl z-20 px-4">
        <FaucetForm />
      </div>

    </div>
  );
}
