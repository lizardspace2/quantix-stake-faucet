
import { Transaction, TxIn, TxOut, UnspentTxOut, getTransactionId } from './transaction';
import * as _ from 'lodash';
import * as DilithiumModule from 'dilithium-crystals-js';

// Environment variables should hold the faucet's private key
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY || '';

let dilithiumInstance: any = null;
const DILITHIUM_LEVEL = 2;

export const initDilithium = async (): Promise<void> => {
    if (dilithiumInstance === null) {
        dilithiumInstance = await DilithiumModule;
    }
};

export const getDilithiumSync = (): any => {
    if (dilithiumInstance === null) {
        throw new Error('Dilithium not initialized. Ensure initDilithium() was called.');
    }
    return dilithiumInstance;
};

export const getPublicFromWallet = (): string => {
    if (!FAUCET_PRIVATE_KEY) {
        throw new Error('FAUCET_PRIVATE_KEY not set');
    }
    try {
        const keyPair = JSON.parse(FAUCET_PRIVATE_KEY);
        // Assuming the stored key is in the format { publicKey: [...], privateKey: [...] }
        return Buffer.from(keyPair.publicKey).toString('hex');
    } catch (error) {
        // Fallback or error handling if key format differs
        throw new Error('Invalid key format in Env Var');
    }
};

export const getPublicKey = (privateKey: string): string => {
    const keyPair = JSON.parse(privateKey);
    return Buffer.from(keyPair.publicKey).toString('hex');
};

export const createTransaction = (receiverAddress: string, amount: number,
    unspentTxOuts: UnspentTxOut[], pool: Transaction[]): Transaction => {

    const privateKey = FAUCET_PRIVATE_KEY;
    const myAddress = getPublicKey(privateKey);

    // Filter out pool txs (simplification: minimal checks for now)
    const myUnspentTxOuts = unspentTxOuts.filter((uTxO: UnspentTxOut) => uTxO.address === myAddress);

    // Simple coin selection: find first unspent that covers amount
    // In a real faucet, we likely have one large UTXO or need to consolidate.
    // For this MVP, we'll just greedy select.

    const { includedUnspentTxOuts, leftOverAmount } = findTxOutsForAmount(amount, myUnspentTxOuts);

    const matchUnsignedTxIn = (unspentTxOut: UnspentTxOut): TxIn => {
        const txIn: TxIn = new TxIn();
        txIn.txOutId = unspentTxOut.txOutId;
        txIn.txOutIndex = unspentTxOut.txOutIndex;
        return txIn;
    };

    const unsignedTxIns: TxIn[] = includedUnspentTxOuts.map(matchUnsignedTxIn);

    const tx: Transaction = new Transaction();
    tx.txIns = unsignedTxIns;
    tx.txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
    tx.id = getTransactionId(tx);

    // Sign
    tx.txIns = tx.txIns.map((txIn: TxIn, index: number) => {
        txIn.signature = signTxIn(tx, index, privateKey, unspentTxOuts);
        return txIn;
    });

    return tx;
};

const findTxOutsForAmount = (amount: number, myUnspentTxOuts: UnspentTxOut[]) => {
    let currentAmount = 0;
    const includedUnspentTxOuts = [];
    for (const myUnspentTxOut of myUnspentTxOuts) {
        includedUnspentTxOuts.push(myUnspentTxOut);
        currentAmount = currentAmount + myUnspentTxOut.amount;
        if (currentAmount >= amount) {
            const leftOverAmount = currentAmount - amount;
            return { includedUnspentTxOuts, leftOverAmount };
        }
    }
    throw Error('Insufficient funds in faucet wallet');
};

const createTxOuts = (receiverAddress: string, myAddress: string, amount: number, leftOverAmount: number) => {
    const txOut1: TxOut = new TxOut(receiverAddress, amount);
    if (leftOverAmount === 0) {
        return [txOut1];
    } else {
        const leftOverTx = new TxOut(myAddress, leftOverAmount);
        return [txOut1, leftOverTx];
    }
};

const signTxIn = (transaction: Transaction, txInIndex: number,
    privateKey: string, aUnspentTxOuts: UnspentTxOut[]): string => {
    const txIn: TxIn = transaction.txIns[txInIndex];
    const dataToSign = transaction.id;
    const dilithium = getDilithiumSync();

    const keyPair = JSON.parse(privateKey);
    // Convert arrays back to Uint8Array if needed by library, assuming JSON stores regular arrays
    const privKey = new Uint8Array(keyPair.privateKey);

    // Sign the transaction ID (dataToSign)
    // Note: Library usage might require converting hex string to buffer
    const msg = Buffer.from(dataToSign, 'hex'); // or just 'utf8' depending on implementation

    // Dilithium signature logic
    const signature = dilithium.sign(privKey, msg);
    return Buffer.from(signature).toString('hex');
};
