package handlers

import (
	"log"
	"net/http"
	"skribble-backend/internals/game"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func HandleWs(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roomId := vars["roomId"]
	userName := vars["userName"]

	if roomId == "" || userName == "" {
		http.Error(w, "Room ID and username are required", http.StatusBadRequest)
		return
	}

	room, ok := game.GetRoom(roomId)
	if !ok {
		http.Error(w, "Room not found", http.StatusNotFound)
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
