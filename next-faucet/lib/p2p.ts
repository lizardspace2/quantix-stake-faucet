
import WebSocket from 'ws';
import { Transaction } from './transaction';
import { getPublicFromWallet } from './wallet';

export enum MessageType {
    QUERY_LATEST = 0,
    QUERY_ALL = 1,
    RESPONSE_BLOCKCHAIN = 2,
    QUERY_TRANSACTION_POOL = 3,
    RESPONSE_TRANSACTION_POOL = 4,
    QUERY_HEADERS = 5,
    RESPONSE_HEADERS = 6,
    QUERY_BLOCK_DATA = 7,
    RESPONSE_BLOCK_DATA = 8
}


export class Message {
    public type!: MessageType;
    public data: any;
}


// Trusted Node is used to get the reference height and broadcast transactions
const TRUSTED_NODE_URL = process.env.TRUSTED_NODE_URL || 'ws://localhost:6001';


const JSONToObject = <T>(data: string): T | null => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};


/**
 * Connects to the user's node IP, requests the latest block, and returns the block index.
 * Returns -1 if connection fails or invalid response.
 */
export const checkNodeStatus = (ip: string): Promise<number> => {
    return new Promise((resolve) => {
        // Ensure IP has protocol
        const url = ip.startsWith('ws://') || ip.startsWith('wss://') ? ip : `ws://${ip}`;

        const ws = new WebSocket(url);

        const timeout = setTimeout(() => {
            ws.terminate();
            resolve(-1);
        }, 5000); // 5s timeout

        ws.on('open', () => {
            // Send Query Latest
            const msg: Message = { type: MessageType.QUERY_LATEST, data: null };
            ws.send(JSON.stringify(msg));
        });

        ws.on('message', (data: string) => {
            try {

                const message = JSONToObject<Message>(data);

                if (message && message.type === MessageType.RESPONSE_BLOCKCHAIN) {
                    const blocks = JSONToObject<any[]>(message.data);
                    if (blocks && blocks.length > 0) {
                        const latestBlock = blocks[blocks.length - 1];
                        if (typeof latestBlock.index === 'number') {
                            clearTimeout(timeout);
                            ws.close();
                            resolve(latestBlock.index);
                            return;
                        }
                    }
                }
            } catch (e) {
                console.error('Error parsing response from user node', e);
            }
        });

        ws.on('error', () => {
            clearTimeout(timeout);
            resolve(-1);
        });
    });
};

/**
 * Gets the current height of the trusted blockchain.
 */
export const getTrustedHeight = (): Promise<number> => {
    return checkNodeStatus(TRUSTED_NODE_URL);
};

/**
 * Broadcasts a transaction to the Trusted Node (which will propagate it).
 */
export const broadcastTx = (transaction: Transaction): Promise<boolean> => {
    return new Promise((resolve) => {
        const ws = new WebSocket(TRUSTED_NODE_URL);

        const timeout = setTimeout(() => {
            ws.terminate();
            resolve(false);
        }, 5000);

        ws.on('open', () => {
            // Wrap pool query response logic? 
            // Actually, we just want to push a transaction.
            // In original p2p, we don't have a direct "PUSH_TX" message, 
            // usually it's RESPONSE_TRANSACTION_POOL with an array of txs.

            const msg: Message = {
                type: MessageType.RESPONSE_TRANSACTION_POOL,
                data: JSON.stringify([transaction])
            };
            ws.send(JSON.stringify(msg));

            // Give it a moment to send, then close
            setTimeout(() => {
                clearTimeout(timeout);
                ws.close();
                resolve(true);
            }, 1000);
        });

        ws.on('error', (err) => {
            console.error('Broadcast error:', err);
            clearTimeout(timeout);
            resolve(false);
        });
    });
};
