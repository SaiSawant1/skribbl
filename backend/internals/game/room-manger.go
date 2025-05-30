package game

import (
	"errors"
	"strings"
	"sync"
)

var (
	rooms           = make(map[string]*Room)
	mu              sync.RWMutex
	ErrRoomNotFound = errors.New("room not found")
	ErrRoomFull     = errors.New("room is full")
)

func CreateRoom() *Room {
	mu.Lock()
	defer mu.Unlock()

	room := NewRoom()
	rooms[room.RoomId] = room

	go room.run()
	return room
}

func GetRoom(roomId string) (*Room, bool) {
	mu.RLock()
	defer mu.RUnlock()

	room, exists := rooms[roomId]
	return room, exists
}

func RemoveRoom(roomId string) {
	mu.Lock()
	defer mu.Unlock()
	delete(rooms, roomId)
}

func CanJoinRoom(roomId string) error {
	mu.RLock()
	defer mu.RUnlock()

	room, exists := rooms[roomId]
	if !exists {
		return ErrRoomNotFound
	}

	if len(room.Clients) >= int(room.Game.MaxPlayers) {
		return ErrRoomFull
	}

	return nil
}

func UpdateConfiguration(roomId string, userName string, maxPlayers uint, maxRounds uint, wordLength uint) bool {
	room, ok := GetRoom(roomId)
	if !ok {
		return false
	}

	mu.Lock()
	defer mu.Unlock()

	if room.Admin.UserName != userName {
		return false
	}

	room.CurrentPlayer = room.Admin
	room.Game.MaxPlayers = maxPlayers
	room.Game.MaxRounds = maxRounds
	room.Game.WordLength = wordLength
	room.GameState = "WAITING"

	room.GamestateBroadcast <- GameStateMessage{
		CurrentPlayer: userName,
		RoomId:        room.RoomId,
		MaxPlayers:    maxPlayers,
		MaxRounds:     maxRounds,
		CurrentRound:  room.Game.CurrentRound,
		WordLength:    wordLength,
		Type:          "game:state",
		GameState:     room.GameState,
		AdminUserName: room.Admin.UserName,
	}
	return true
}

func SetWord(roomId string, userName string, word string) bool {
	room, ok := GetRoom(roomId)
	if !ok {
		return false
	}

	mu.Lock()
	defer mu.Unlock()

	if room.CurrentPlayer.UserName != userName {
		return false
	}

	room.Game.Word = strings.ToUpper(word)

	room.GameState = "START"

	room.GamestateBroadcast <- GameStateMessage{
		Word:          room.Game.Word,
		CurrentPlayer: room.CurrentPlayer.UserName,
		RoomId:        room.RoomId,
		MaxPlayers:    room.Game.MaxPlayers,
		MaxRounds:     room.Game.MaxRounds,
		CurrentRound:  room.Game.CurrentRound,
		WordLength:    room.Game.WordLength,
		Type:          "game:state",
		GameState:     room.GameState,
		AdminUserName: room.Admin.UserName,
	}

	return true
}

func ChangeTurn(r *Room) {
	mu.Lock()
	defer mu.Unlock()

	currPlayer := r.PlayerQueue[0]
	otherPlayers := r.PlayerQueue[1:]
	r.PlayerQueue = otherPlayers
	r.PlayerQueue = append(r.PlayerQueue, currPlayer)
	r.CurrentPlayer = r.PlayerQueue[0]

	r.GameState = "WAITING"
	r.Game.Word = ""
	r.Game.CurrentRound = r.Game.CurrentRound + 1
	r.CorrectGuess = 0

	r.GamestateBroadcast <- GameStateMessage{
		Word:          r.Game.Word,
		CurrentPlayer: r.CurrentPlayer.UserName,
		RoomId:        r.RoomId,
		MaxPlayers:    r.Game.MaxPlayers,
		MaxRounds:     r.Game.MaxRounds,
		CurrentRound:  r.Game.CurrentRound,
		WordLength:    r.Game.WordLength,
		Type:          "game:state",
		GameState:     r.GameState,
		AdminUserName: r.Admin.UserName,
	}

	go r.SendPositions()

}
