import { AlertTriangle } from 'lucide-react';
import { Logo } from '../ui/Logo';

export function FaucetHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <Logo
          iconClassName="h-20 w-20"
          showText={false}
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">
          QUANTIX <span className="text-primary">Faucet</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Quantum Resistant Blockchain | Powered by Crystals-Dilithium
        </p>
        <p className="text-muted-foreground/70 mt-1 text-xs">
          Get free testnet coins by proving you run a synchronized node
        </p>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>Demo Mode - Claims stored locally</span>
      </div>
    </div>
  );
}
