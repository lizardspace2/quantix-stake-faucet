
import { FaucetForm } from "@/components/FaucetForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl -z-10" />

      <div className="z-10 text-center mb-12 space-y-4 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-2">
          Naivecoin<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">Stake</span>
        </h1>
        <p className="text-xl text-slate-400 font-light">
          Incentivizing the Post-Quantum Network.
        </p>
        <p className="text-sm text-slate-500 bg-slate-900/50 inline-block px-4 py-1 rounded-full border border-slate-800">
          Node Reward Program
        </p>
      </div>

      <div className="w-full max-w-md z-10">
        <FaucetForm />
      </div>

    </div>
  );
}
