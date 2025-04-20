package main

import (
	"net/http"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/api/create-room", func(w http.ResponseWriter, r *http.Request) {}).Methods("POST")
	r.HandleFunc("/api/join-room", func(w http.ResponseWriter, r *http.Request) {}).Methods("POST")
	r.HandleFunc("/ws/{roomID}", func(w http.ResponseWriter, r *http.Request) {}).Methods("POST")

	return r
}
