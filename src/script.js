import * as bitcoin from 'bitcoinjs-lib';
import { secp256k1 } from "@noble/curves/secp256k1";
import * as crypto from "node:crypto";

/**
 * Create Pay to Witness Script Hash based on this script :
 * `<sig1> <pubkey1> CHECKSIG <sig2> <pubkey2> CHECKSIG AND`
 */
function createP2WSH() {
    // Generate two random key pairs
    const privateKey1 = crypto.randomBytes(32).toString('hex');
    const privateKey2 = crypto.randomBytes(32).toString('hex');
    const pubkey1 = secp256k1.getPublicKey(privateKey1);
    const pubkey2 = secp256k1.getPublicKey(privateKey2);

    // Create the redeem script
    const redeemScript = bitcoin.script.compile([
        pubkey1,                          // First public key
        bitcoin.opcodes.OP_CHECKSIG,      // CHECKSIG for sig1 and pubkey1
        pubkey2,                          // Second public key
        bitcoin.opcodes.OP_CHECKSIG,      // CHECKSIG for sig2 and pubkey2
        bitcoin.opcodes.OP_BOOLAND        // Combine both results with AND
    ]);

    // Create a P2WSH payment object
    const p2wsh = bitcoin.payments.p2wsh({
        redeem: {output: redeemScript},
    });

    console.log('P2WSH', p2wsh.address);
    return p2wsh.address;
}

export { createP2WSH };
