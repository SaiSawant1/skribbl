package handlers

import (
	"log"
	"net/http"
	"skribble-backend/internals/game"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func HandleWs(w http.ResponseWriter, r *http.Request) {
	roomId := r.URL.Query().Get("roomId")
	userName := r.URL.Query().Get("userName")

	if roomId == "" || userName == "" {
		http.Error(w, "Room ID and username are required", http.StatusBadRequest)
		return
	}

	// Get or create the room
	room, ok := game.GetRoom(roomId)
	if !ok {
		http.Error(w, "No Room Found", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade error: %v", err)
		http.Error(w, "Failed to upgrade connection", http.StatusInternalServerError)
		return
	}

	client := game.NewClient(conn, room, userName)
	room.Register <- client

	go client.Read()
	go client.Write()
}
