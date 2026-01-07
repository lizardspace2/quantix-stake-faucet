

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { checkNodeStatus, getTrustedHeight, broadcastTx } from '@/lib/p2p';
import { createTransaction, initDilithium, getPublicFromWallet } from '@/lib/wallet';
import { UnspentTxOut } from '@/lib/transaction';


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
    console.log('[API] /api/claim - Request received');
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { address, nodeIp } = body;
    console.log(`[API] Processing claim for Address: ${address}, NodeIP: ${nodeIp}`);

    if (!address || !nodeIp) {
        return NextResponse.json({ error: 'Address and Node IP are required' }, { status: 400 });
    }

    try {
        // 1. Check Rate Limit
        console.log('[API] Checking Supabase for rate limit...');
        const curDate = new Date();
        const lastMonth = new Date(curDate.setMonth(curDate.getMonth() - 1)).toISOString();

        const { data: claims, error: claimError } = await supabase
            .from('faucet_claims')
            .select('created_at')
            .eq('address', address)
            .gte('created_at', lastMonth)
            .limit(1);

        if (claimError) {
            console.error(`[API] Supabase Error: ${JSON.stringify(claimError)}`);
            return NextResponse.json({ error: 'Database error checking claims' }, { status: 500 });
        }

        if (claims && claims.length > 0) {
            console.log('[API] Rate limit exceeded');
            return NextResponse.json({ error: 'Monthly quota exceeded. Try again later.' }, { status: 429 });
        }
        console.log('[API] Rate limit check passed');

        // 2. Init Crypto
        console.log('[API] Initializing Dilithium...');
        await initDilithium();
        console.log('[API] Dilithium initialized');

        // 3. Verify Node Sync
        console.log('[API] Verifying trusted node height...');
        const trustedHeight = await getTrustedHeight();
        console.log(`[API] Trusted Height: ${trustedHeight}`);

        if (trustedHeight === -1) {
            console.error('[API] ERROR: Trusted node unreachable');
            return NextResponse.json({ error: 'Faucet internal error: Trusted node unreachable' }, { status: 500 });
        }

        console.log(`[API] Checking User Node: ${nodeIp}`);
        const userHeight = await checkNodeStatus(nodeIp);
        console.log(`[API] User Height: ${userHeight}`);

        if (userHeight === -1) {
            return NextResponse.json({ error: 'Could not connect to your node. Ensure it is reachable.' }, { status: 400 });
        }

        const syncDiff = Math.abs(trustedHeight - userHeight);
        if (syncDiff > 2) {
            console.log(`[API] Node sync mismatch. User: ${userHeight}, Trusted: ${trustedHeight}`);
            return NextResponse.json({ error: `You must sync your node first. Your Height: ${userHeight}, Network: ${trustedHeight}` }, { status: 400 });
        }
        console.log('[API] Node sync verfied');

        // 4. Calculate Distribution Amount
        console.log('[API] Calculating distribution amount...');
        const { count: totalClaims, error: countError } = await supabase
            .from('faucet_claims')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('[API] Failed to get total claims count:', countError);
            return NextResponse.json({ error: 'Database error counting claims' }, { status: 500 });
        }

        let amount = 5;
        const count = totalClaims || 0;

        if (count <= 10) {
            amount = 50;
        } else if (count <= 50) {
            amount = 25;
        } else if (count <= 100) {
            amount = 10;
        } else {
            amount = 5;
        }

        console.log(`[API] Total Claims: ${count}, Distribution Amount: ${amount}`);

        // 5. Create Transaction
        console.log('[API] Fetching faucet wallet info...');
        const faucetAddress = getPublicFromWallet();
        console.log(`[API] Faucet PubKey: ${faucetAddress}`);

        console.log('[API] Fetching UTXOs...');
        const unspentTxOuts = await fetchUnspentTxOuts(faucetAddress);
        console.log(`[API] Found ${unspentTxOuts.length} UTXOs`);

        const availableBalance = unspentTxOuts.reduce((a, b) => a + b.amount, 0);
        console.log(`[API] Available Balance: ${availableBalance}`);

        if (availableBalance < amount) {
            console.log('[API] Insufficient balance');
            return NextResponse.json({ error: 'Faucet is empty, please try again later.' }, { status: 503 });
        }

        console.log('[API] Creating transaction...');
        const tx = createTransaction(address, amount, unspentTxOuts, []);
        console.log(`[API] Transaction created: ${tx.id}`);

        // 6. Broadcast
        console.log('[API] Broadcasting transaction...');
        const broadcastSuccess = await broadcastTx(tx);
        console.log(`[API] Broadcast result: ${broadcastSuccess}`);

        if (!broadcastSuccess) {
            console.log('[API] Broadcast failed');
            return NextResponse.json({ error: 'Failed to broadcast transaction' }, { status: 500 });
        }

        // 7. Record Claim
        console.log('[API] Recording claim...');
        await supabase.from('faucet_claims').insert({
            address: address,
            amount: amount,
            ip_address: nodeIp
        });
        console.log('[API] Claim recorded!');

        return NextResponse.json({ message: `${amount} QUANTIX sent!`, txId: tx.id });

    } catch (e: any) {
        console.error(`[API] EXCEPTION: ${e.message}`);
        console.error(e);
        console.error('[API] Handler Logic Error:', e);
        return NextResponse.json({ error: e.message || 'Internal logic error' }, { status: 500 });
    }
}
