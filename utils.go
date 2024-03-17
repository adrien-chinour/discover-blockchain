package main

import "crypto"

func hash(input []byte, hash crypto.Hash) []byte {
	hasher := hash.New()
	hasher.Write(input)

	return hasher.Sum(nil)
}
