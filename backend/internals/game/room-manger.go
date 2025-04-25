package game

import (
	"errors"
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

	room.Game.MaxPlayers = maxPlayers
	room.Game.MaxRounds = maxRounds
	room.Game.WordLength = wordLength
	room.GameState = "START"

	return true
}
