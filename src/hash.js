import * as crypto from "node:crypto";

/**
 * @param {Buffer} buffer
 * @returns {Buffer}
 */
function ripemd160(buffer) {
    return crypto.createHash('ripemd160').update(buffer).digest();
}

/**
 * @param {Buffer} buffer
 * @returns {Buffer}
 */
function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

/**
 * Base58Check is used for encoding Bitcoin addresses.
 * @see https://en.bitcoin.it/wiki/Base58Check_encoding
 * @param {Buffer} buffer
 * @return {Buffer}
 */
function base58check(buffer) {
    return Buffer.concat([buffer, sha256(sha256(buffer)).subarray(0, 4)]);
}

export { ripemd160, sha256, base58check }
