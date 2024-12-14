import { createP2PKH, createP2WPKH } from "./src/address.js";
import { createP2WSH } from "./src/script.js";

console.log('=> Create P2PKH');
createP2PKH();

console.log('\n');

console.log('=> Create P2WPKH');
createP2WPKH();

console.log('\n');

console.log('=> Create P2WSH');
createP2WSH();
