
import * as _ from 'lodash';
import * as CryptoJS from 'crypto-js';
import * as DilithiumModule from 'dilithium-crystals-js';

// Minimal Tx implementation for Faucet

export class TxOut {
    public address: string;
    public amount: number;

    constructor(address: string, amount: number) {
        this.address = address;
        this.amount = amount;
    }
}


export class TxIn {
    public txOutId!: string;
    public txOutIndex!: number;
    public signature!: string;
}

export class Transaction {
    public id!: string;
    public txIns!: TxIn[];
    public txOuts!: TxOut[];
}


export class UnspentTxOut {
    public readonly txOutId: string;
    public readonly txOutIndex: number;
    public readonly address: string;
    public readonly amount: number;

    constructor(txOutId: string, txOutIndex: number, address: string, amount: number) {
        this.txOutId = txOutId;
        this.txOutIndex = txOutIndex;
        this.address = address;
        this.amount = amount;
    }
}

export const getTransactionId = (transaction: Transaction): string => {
    const txInContent: string = transaction.txIns
        .map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex)
        .reduce((a, b) => a + b, '');

    const txOutContent: string = transaction.txOuts
        .map((txOut: TxOut) => txOut.address + txOut.amount)
        .reduce((a, b) => a + b, '');

    return CryptoJS.SHA256(txInContent + txOutContent).toString();
};

export const signTxIn = (transaction: Transaction, txInIndex: number,
    privateKey: string, aUnspentTxOuts: UnspentTxOut[]): string => {
    const txIn: TxIn = transaction.txIns[txInIndex];

    const dataToSign = transaction.id;

    const referencedUnspentTxOut = findUnspentTxOut(txIn.txOutId, txIn.txOutIndex, aUnspentTxOuts);
    if (!referencedUnspentTxOut) {
        console.log('could not find referenced txOut');
        throw Error('could not find referenced txOut');
    }
    const referencedAddress = referencedUnspentTxOut.address;


    // Dilithium signing
    // NOTE: This requires the dilithium instance to be initialized in wallet.ts
    // We assume the caller handles initialization or we pass the instance. 
    // For simplicity in this structure, we'll assume the wallet module handles the actual crypto call
    // but here we just need the structure. 
    // Actually, in the original code, signTxIn used `getDilithiumSync()`. 
    // We will export a signer function from wallet.ts to avoid circular deps if possible, 
    // or just import the instance here if initialized.

    // To match original structure, we'll keep the signature logic here but might need to import the crypto lib.
    // For now, let's keep it simple and assume wallet.ts does the heavy lifting or we duplicate the init logic.
    return ""; // Placeholder, will be handled in wallet.ts or `createTransaction` flow
};


const findUnspentTxOut = (txOutId: string, txOutIndex: number, aUnspentTxOuts: UnspentTxOut[]): UnspentTxOut | undefined => {
    return aUnspentTxOuts.find((uTxO) => uTxO.txOutId === txOutId && uTxO.txOutIndex === txOutIndex);
};

