package main

import "fmt"

func main() {
	address, _ := GeneratePayToPublicKeyHash()
	fmt.Printf("Public Address : %s\nPrivate Key : %s\n", address.address, address.privateKey)
}
