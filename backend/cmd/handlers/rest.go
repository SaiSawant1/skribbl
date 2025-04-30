package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"skribble-backend/internals/game"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

type CreateRoomRequest struct {
	UserName string `json:"userName"`
}

type CreateRoomResponse struct {
	RoomId string `json:"roomId"`
}

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var createRoomRequest CreateRoomRequest

	if err := json.NewDecoder(r.Body).Decode(&createRoomRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
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

type JoinRoomRequest struct {
	RoomId   string `json:"roomId"`
	UserName string `json:"userName"`
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

type ConfigureRoomRequest struct {
	RoomId     string `json:"roomId"`
	UserName   string `json:"userName"`
	MaxPlayers uint   `json:"maxPlayers"`
	WordLength uint   `json:"wordLength"`
	MaxRounds  uint   `json:"maxRounds"`
}

type ConfigureRoomResponse struct {
	RoomId        string `json:"roomId"`
	AdminUserName string `json:"adminUserName"`
	MaxPlayers    uint   `json:"maxPlayers"`
	WordLength    uint   `json:"wordLength"`
	MaxRounds     uint   `json:"maxRounds"`
	GameState     string `json:"gameState"`
	Word          string `json:"word"`
	CurrentPlayer string `json:"currentPlayer"`
}

func UpdateConfiguration(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
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

	room, ok := game.GetRoom(configureRoomRequest.RoomId)
	if !ok {
		http.Error(w, "Bad Requst failed to update room", http.StatusBadRequest)
		return
	}

	response := ConfigureRoomResponse{
		RoomId:        room.RoomId,
		AdminUserName: room.Admin.UserName,
		MaxPlayers:    room.Game.MaxPlayers,
		WordLength:    room.Game.WordLength,
		MaxRounds:     room.Game.MaxRounds,
		GameState:     room.GameState,
		Word:          room.Game.Word,
		CurrentPlayer: room.CurrentPlayer.UserName,
	}

	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
	}

}

type SetWordRequest struct {
	RoomId   string `json:"roomId"`
	Word     string `json:"word"`
	UserName string `json:"userName"`
}

func SetWord(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	var setWordRequest SetWordRequest
	if err := json.NewDecoder(r.Body).Decode(&setWordRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if setWordRequest.RoomId == "" || setWordRequest.UserName == "" || setWordRequest.Word == "" {
		http.Error(w, "Room ID and username are required", http.StatusBadRequest)
		return
	}

	if !game.SetWord(setWordRequest.RoomId, setWordRequest.UserName, setWordRequest.Word) {
		http.Error(w, "Bad Requst failed to update room", http.StatusBadRequest)
		return

	}

	w.WriteHeader(http.StatusOK)
}
