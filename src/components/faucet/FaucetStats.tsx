import { Card, CardContent } from '@/components/ui/card';
import { Coins, Users, Activity } from 'lucide-react';
import type { Claim } from '@/hooks/useFaucetClaims';

interface FaucetStatsProps {
  claims: Claim[];
}

export function FaucetStats({ claims }: FaucetStatsProps) {
  const totalDistributed = claims.reduce((sum, c) => sum + c.amount, 0);
  const uniqueAddresses = new Set(claims.map(c => c.address.toLowerCase())).size;
  
  const stats = [
    {
      icon: Coins,
      label: 'Total Distributed',
      value: totalDistributed.toLocaleString(),
      suffix: 'coins',
    },
    {
      icon: Users,
      label: 'Unique Addresses',
      value: uniqueAddresses.toLocaleString(),
      suffix: '',
    },
    {
      icon: Activity,
      label: 'Total Claims',
      value: claims.length.toLocaleString(),
      suffix: '',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50 bg-card/30">
          <CardContent className="p-4 text-center">
            <stat.icon className="h-5 w-5 mx-auto text-primary mb-2" />
            <div className="font-mono text-xl font-bold">
              {stat.value}
              {stat.suffix && (
                <span className="text-xs text-muted-foreground ml-1">{stat.suffix}</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
