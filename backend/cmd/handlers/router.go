package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	r.Use(corsMiddleware)

	r.HandleFunc("/create-room", CreateRoom).Methods("POST", "OPTIONS")
	r.HandleFunc("/join-room", JoinRoom).Methods("POST", "OPTIONS")
	r.HandleFunc("/{roomId}/configure", UpdateConfiguration).Methods("POST", "OPTIONS")
	r.HandleFunc("/{roomId}/word", SetWord).Methods("POST", "OPTIONS")
	r.HandleFunc("/ws", HandleWs).Methods("GET", "OPTIONS") // Changed to GET for WebSocket

	return r
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
