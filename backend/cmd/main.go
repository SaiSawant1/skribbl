package main

import (
	"log"
	"net/http"
)

func main() {
	r := SetupRouter()

	log.Printf("Server running on http://localhost:8080")

	log.Fatal(http.ListenAndServe(":8080", r))

}
