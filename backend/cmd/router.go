package main

import (
	"net/http"
	"skribble-backend/cmd/handlers"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/api/create-room", handlers.CreateRoom).Methods("POST")
	r.HandleFunc("/api/join-room", handlers.JoinRoom).Methods("POST")
	r.HandleFunc("/ws/{roomID}", func(w http.ResponseWriter, r *http.Request) {}).Methods("POST")

	return r
}
