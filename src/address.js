// This is a low-level code to understand how to generate a Bitcoin address

import { secp256k1 } from "@noble/curves/secp256k1";
import { binary_to_base58 } from "base58-js";
import { base58check, ripemd160, sha256 } from "./hash.js";
import { bech32 } from "bech32";

/**
 * Generate a Pay to Public Key Hash bitcoin address
 * @see https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses
 */
function createP2PKH() {
    // The private key in ECDSA is a randomly generated 256-bit integer used as the secret in cryptographic operations.
    // It must be kept secure, as it is the foundation for deriving the public key and signing transactions.
    // const privateKey = crypto.randomBytes(32).toString('hex');
    const privateKey = '18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725';
    console.log('Private Key', privateKey); // 18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725

    // The public key is derived from the private key using elliptic curve multiplication (privateKey * G).
    // It is a pair of coordinates (x, y) on the secp256k1 and is safe to share publicly.
    const publicKey = secp256k1.getPublicKey(privateKey);
    console.log('Public Key', Buffer.from(publicKey).toString('hex')); // 0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352

    // The network version byte (0x00) is added to indicate the Bitcoin main network.
    // SHA-256 and RIPEMD-160 are used to compress and secure the public key into a shorter hash.
    const networkVersion = Buffer.from([0x00]);
    const extendedPublicKey = Buffer.concat([networkVersion, ripemd160(sha256(Buffer.from(publicKey)))]);
    console.log('Public Key Hash', extendedPublicKey.toString('hex')); // 00f54a5851e9372b87810a8e60cdd2e7cfd80b6e31

    // Base58Check encoding is used to create a human-readable Bitcoin address.
    // It avoids ambiguous characters (e.g., "0" and "O") and includes the checksum to detect errors.
    const btcAddress = binary_to_base58(base58check(Buffer.from(extendedPublicKey)))
    console.log('Bitcoin Address (P2PKH)', btcAddress); // 1PMycacnJaSqwwJqjawXBErnLsZ7RkXUAs

    return btcAddress;
}

/**
 * Generate a Pay to Witness Public Key Hash bitcoin address
 * @see https://en.bitcoin.it/wiki/Bech32
 */
function createP2WPKH() {
    // The private key in ECDSA is a randomly generated 256-bit integer used as the secret in cryptographic operations.
    // It must be kept secure, as it is the foundation for deriving the public key and signing transactions.
    const privateKey = '18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725';
    console.log('Private Key', privateKey); // Example private key

    // The public key is derived from the private key using elliptic curve multiplication (privateKey * G).
    // It is a pair of coordinates (x, y) on the secp256k1 curve and is safe to share publicly.
    const publicKey = secp256k1.getPublicKey(privateKey);
    console.log('Public Key', Buffer.from(publicKey).toString('hex')); // Example public key

    // Hash the public key with SHA-256, then RIPEMD-160 to create the public key hash.
    const publicKeyHash = ripemd160(sha256(Buffer.from(publicKey)));
    console.log('Public Key Hash', publicKeyHash.toString('hex'));

    // Convert to 5-bit words (Bech32 requires base32 encoding)
    const words = bech32.toWords(publicKeyHash); // Convert public key hash to 5-bit words
    words.unshift(0x00); // Prepend the witness version byte (P2WPKH is version 0)

    // Encode with Bech32
    const humanReadablePart = 'bc'; // HRP (bc for MainNet and tb for TestNet)
    const btcAddress = bech32.encode(humanReadablePart, words);
    console.log('Bitcoin Address (P2WPKH)', btcAddress);

    return btcAddress;
}

export { createP2PKH, createP2WPKH };
