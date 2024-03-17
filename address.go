package main

import (
	"crypto"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"encoding/hex"
	"fmt"

	"github.com/btcsuite/btcd/btcutil/base58"
	_ "golang.org/x/crypto/ripemd160"
)

type PayToPublicKeyHash struct {
	address    string
	privateKey string
}

// GeneratePayToPublicKeyHash Generate new random P2PKH address
func GeneratePayToPublicKeyHash() (*PayToPublicKeyHash, error) {
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		fmt.Println("Error while generating private key.", err)
		return nil, err
	}

	// Generate bitcoin address from public key
	address, err := publicKeyToAddress(privateKey.PublicKey)
	if err != nil {
		fmt.Println("Error while generating address.", err)
		return nil, err
	}

	return &PayToPublicKeyHash{address, hex.EncodeToString(privateKey.D.Bytes())}, nil
}

func publicKeyToAddress(publicKey ecdsa.PublicKey) (string, error) {
	publicKeyBytes := append(publicKey.X.Bytes(), publicKey.Y.Bytes()...)

	network := byte(0x00)
	fingerprint := hash(hash(publicKeyBytes, crypto.SHA256), crypto.RIPEMD160)

	address := append([]byte{network}, fingerprint...)
	checksum := hash(hash(address, crypto.SHA256), crypto.SHA256)[:4]

	return base58.Encode(append(address, checksum...)), nil
}
