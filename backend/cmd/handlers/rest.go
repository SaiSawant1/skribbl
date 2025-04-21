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

	_, ok := game.GetRoom(req.RoomId)
	if !ok {
		http.Error(w, "Room not found", http.StatusNotFound)
		return
	}

	// TODO: Add logic to check if room is full or if username is already taken
	w.WriteHeader(http.StatusOK)
}
