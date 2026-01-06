import { FaucetHeader } from '@/components/faucet/FaucetHeader';
import { ClaimForm } from '@/components/faucet/ClaimForm';
import { RecentClaims } from '@/components/faucet/RecentClaims';
import { FaucetStats } from '@/components/faucet/FaucetStats';
import { useFaucetClaims } from '@/hooks/useFaucetClaims';

const Index = () => {
  const { 
    claims, 
    recentClaims, 
    addClaim, 
    canClaim, 
    getRemainingAmount, 
    coinsPerClaim 
  } = useFaucetClaims();

  const handleClaim = (address: string, nodeIp: string): boolean => {
    const claim = addClaim(address, nodeIp);
    return claim !== null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background grid pattern */}
      <div 
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      
      <div className="relative max-w-2xl mx-auto px-4 py-12 space-y-8">
        <FaucetHeader />
        
        <FaucetStats claims={claims} />
        
        <ClaimForm
          onClaim={handleClaim}
          canClaim={canClaim}
          getRemainingAmount={getRemainingAmount}
          coinsPerClaim={coinsPerClaim}
        />
        
        <RecentClaims claims={recentClaims} />
        
        <footer className="text-center text-xs text-muted-foreground font-mono pt-8 border-t border-border/50">
          <p>NaivecoinStake Faucet • Demo Mode</p>
          <p className="mt-1">Node verification simulated • Claims persist in localStorage</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
