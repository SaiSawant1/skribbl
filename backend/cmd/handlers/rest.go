package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"skribble-backend/internals/game"
)

type CreateRoomResponse struct {
	RoomId string `json:"roomId"`
}

type JoinRoomRequest struct {
	RoomId   string `json:"roomId"`
	UserName string `json:"userName"`
}

type ConfigureRoomRequest struct {
	RoomId     string `json:"roomId"`
	UserName   string `json:"userName"`
	MaxPlayers uint   `json:"maxPlayers"`
	WordLength uint   `json:"wordLength"`
	MaxRounds  uint   `json:"maxRounds"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	room := game.CreateRoom()
	response := CreateRoomResponse{RoomId: room.RoomId}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}
	log.Printf("ROOM CREATED roomID: %s", room.RoomId)

}

func JoinRoom(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req JoinRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.RoomId == "" || req.UserName == "" {
		http.Error(w, "Room ID and username are required", http.StatusBadRequest)
		return
	}

	room, ok := game.GetRoom(req.RoomId)
	if !ok {
		http.Error(w, "Room not found", http.StatusNotFound)
		return
	}

	for key, _ := range room.Clients {
		if key.UserName == req.UserName {
			http.Error(w, "User Name Already Take Choose different", http.StatusBadRequest)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
}

func UpdateConfiguration(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var configureRoomRequest ConfigureRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&configureRoomRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if configureRoomRequest.RoomId == "" || configureRoomRequest.UserName == "" {
		http.Error(w, "Room ID and username are required", http.StatusBadRequest)
		return
	}

	if !game.UpdateConfiguration(configureRoomRequest.RoomId, configureRoomRequest.UserName, configureRoomRequest.MaxPlayers, configureRoomRequest.MaxRounds, configureRoomRequest.WordLength) {
		http.Error(w, "Bad Requst failed to update room", http.StatusBadRequest)
		return

	}

	w.WriteHeader(http.StatusOK)

}
