
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkNodeStatus, getTrustedHeight, broadcastTx } from '@/lib/p2p';
import { createTransaction, initDilithium, getPublicFromWallet } from '@/lib/wallet';
import { UnspentTxOut } from '@/lib/transaction';

// Supabase Init
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use Service Role for strict checks if RLS is on, or just standard key if public allows inserts
const supabase = createClient(supabaseUrl, supabaseKey);

// Trusted Node URL for UTXO fetching (needed for balance/signing)
// Realistically, we need an API to fetch unspent outputs for our address
// or we maintain a local pool. For this Faucet, we will assume we can fetch UTXOs 
// from the trusted node via HTTP or just mock it if API isn't available.
// Given strict instructions "don't rebuild blockchain", we'll fetch from explorer API if possible.
const EXPLORER_API_URL = process.env.EXPLORER_API_URL || 'http://localhost:3001';

const fetchUnspentTxOuts = async (address: string): Promise<UnspentTxOut[]> => {
    try {
        const res = await fetch(`${EXPLORER_API_URL}/unspentTxOuts/${address}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.map((u: any) => new UnspentTxOut(u.txOutId, u.txOutIndex, u.address, u.amount));
    } catch (e) {
        console.error('Failed to fetch UTXOs', e);
        return [];
    }
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { address, nodeIp } = body;

        if (!address || !nodeIp) {
            return NextResponse.json({ error: 'Address and Node IP are required' }, { status: 400 });
        }

        // 1. Check Rate Limit (1 per month)
        const curDate = new Date();
        const lastMonth = new Date(curDate.setMonth(curDate.getMonth() - 1)).toISOString();

        const { data: claims, error: claimError } = await supabase
            .from('faucet_claims')
            .select('created_at')
            .eq('address', address)
            .gte('created_at', lastMonth)
            .limit(1);

        if (claimError) {
            console.error('Supabase error', claimError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        if (claims && claims.length > 0) {
            return NextResponse.json({ error: 'Monthly quota exceeded. Try again later.' }, { status: 429 });
        }

        // 2. Init Crypto
        await initDilithium();

        // 3. Verify Node Sync
        const trustedHeight = await getTrustedHeight();
        if (trustedHeight === -1) {
            return NextResponse.json({ error: 'Faucet internal error: Trusted node unreachable' }, { status: 500 });
        }

        const userHeight = await checkNodeStatus(nodeIp);
        if (userHeight === -1) {
            return NextResponse.json({ error: 'Could not connect to your node. Check IP/Port and firewall.' }, { status: 400 });
        }

        const syncDiff = Math.abs(trustedHeight - userHeight);
        if (syncDiff > 2) {
            return NextResponse.json({
                error: `Node not synchronized. You: ${userHeight}, Network: ${trustedHeight}. Diff: ${syncDiff}`
            }, { status: 400 });
        }

        // 4. Create Transaction
        // Need our UTXOs
        const faucetAddress = getPublicFromWallet();
        const unspentTxOuts = await fetchUnspentTxOuts(faucetAddress);

        // Check balance (approx)
        const balance = unspentTxOuts.reduce((a, b) => a + b.amount, 0);
        if (balance < 5) {
            return NextResponse.json({ error: 'Faucet is empty!' }, { status: 503 });
        }

        // Create Tx
        // Assuming pool is empty for simplicity or fetch it too
        const tx = createTransaction(address, 5, unspentTxOuts, []);

        // 5. Broadcast
        const broadcastSuccess = await broadcastTx(tx);
        if (!broadcastSuccess) {
            return NextResponse.json({ error: 'Failed to broadcast transaction' }, { status: 500 });
        }

        // 6. Record Claim
        await supabase.from('faucet_claims').insert({
            address: address,
            amount: 5,
            ip_address: nodeIp // Storing Node IP as "ip_address" for now, or request IP
        });

        return NextResponse.json({ message: '5 Coins sent!', txId: tx.id });

    } catch (e: any) {
        console.error('Handler error', e);
        return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
    }
}
