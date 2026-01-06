import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Wallet } from 'lucide-react';
import type { Claim } from '@/hooks/useFaucetClaims';

interface RecentClaimsProps {
  claims: Claim[];
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function truncateAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

export function RecentClaims({ claims }: RecentClaimsProps) {
  if (claims.length === 0) {
    return (
      <Card className="border-border/50 bg-card/30">
        <CardHeader>
          <CardTitle className="text-sm font-mono text-muted-foreground">
            Recent Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No claims yet. Be the first!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/30">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Claims
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-1 p-4 pt-0">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="flex items-center justify-between p-2 rounded bg-background/30 font-mono text-xs"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wallet className="h-3 w-3" />
                  <span className="text-foreground">{truncateAddress(claim.address)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary">+{claim.amount}</span>
                  <span className="text-muted-foreground">{formatTimeAgo(claim.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
