
import { FaucetForm } from "@/components/FaucetForm";
import { FomoStatus } from "@/components/FomoStatus";
import { Logo } from "@/components/Logo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden bg-slate-950">

      {/* Background Elements - Reduced opacity for better contrast */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[120px] -z-10" />

      <div className="z-10 text-center mb-16 space-y-6 max-w-3xl px-4">
        <Logo
          className="justify-center mb-8"
          iconClassName="h-24 w-24"
        />
        <p className="text-2xl md:text-3xl text-slate-300 font-light leading-snug">
          Quantum Resistant Blockchain
          <span className="block text-lg md:text-xl text-slate-400 mt-2 font-normal">
            Powered by <span className="text-teal-400 font-medium">Crystals-Dilithium</span>
          </span>
        </p>

        <div className="pt-4">
          <span className="inline-flex items-center px-4 py-2 rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 text-sm font-medium shadow-sm">
            <span className="w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse"></span>
            Node Reward Program Active
          </span>
        </div>
      </div>

      <FomoStatus />

      <div className="w-full max-w-lg z-10">
        <FaucetForm />
      </div>

    </div>
  );
}
