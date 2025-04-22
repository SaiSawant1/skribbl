package main

import (
	"log"
	"net/http"
	"skribble-backend/cmd/handlers"
)

func main() {
	r := handlers.SetupRouter()

	log.Printf("Server running on http://localhost:8080")

	log.Fatal(http.ListenAndServe(":8080", r))
}
