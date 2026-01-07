import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { count: totalClaims, error: countError } = await supabase
            .from('faucet_claims')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        const count = totalClaims || 0;
        let currentReward = 5;
        let nextReward = 5;
        let remainingInTier = 0;
        let tierName = 'Standard';

        if (count <= 10) {
            currentReward = 50;
            nextReward = 25;
            remainingInTier = 10 - count + 1; // +1 because the current claim is the one we are looking at? No, valid claims are 0..10?
            // If count is 0, we have 11 spots (0 to 10 is 11 items). Wait, "First 10 claims" usually means 1 to 10.
            // Let's assume 1-10 get 50. So if count is 0, 10 left. If count is 9, 1 left.
            remainingInTier = 11 - (count + 1);
            // If 0 claims exist, next is #1. 10 - 1 + 1 = 10.
            // Actually let's simplify: 
            // Tier 1 limit is 10.
            remainingInTier = 10 - count;
            tierName = 'Early Bird';
        } else if (count <= 50) {
            currentReward = 25;
            nextReward = 10;
            remainingInTier = 50 - count;
            tierName = 'High Reward';
        } else if (count <= 100) {
            currentReward = 10;
            nextReward = 5;
            remainingInTier = 100 - count;
            tierName = 'Reduced Reward';
        } else {
            currentReward = 5;
            nextReward = 5;
            remainingInTier = 0;
            tierName = 'Standard';
        }

        return NextResponse.json({
            totalClaims: count,
            currentReward,
            nextReward,
            remainingInTier,
            tierName
        });

    } catch (e) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
