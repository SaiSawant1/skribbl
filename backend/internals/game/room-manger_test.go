package game

import (
	"testing"
)

func TestCreateRoom(t *testing.T) {
	room := CreateRoom()
	if room == nil {
		t.Fatal("Expected room to be created, got nil")
	}

	if room.RoomId == "" {
		t.Error("Expected room to have an ID, got empty string")
	}

	// Verify room exists in the manager
	if _, exists := GetRoom(room.RoomId); !exists {
		t.Error("Expected room to exist in manager after creation")
	}
}

func TestGetRoom(t *testing.T) {
	// Test non-existent room
	if _, exists := GetRoom("non-existent"); exists {
		t.Error("Expected non-existent room to not exist")
	}

	// Test existing room
	room := CreateRoom()
	if foundRoom, exists := GetRoom(room.RoomId); !exists {
		t.Error("Expected room to exist")
	} else if foundRoom.RoomId != room.RoomId {
		t.Error("Expected room IDs to match")
	}
}

func TestCanJoinRoom(t *testing.T) {
	// Test non-existent room
	if err := CanJoinRoom("non-existent"); err != ErrRoomNotFound {
		t.Errorf("Expected ErrRoomNotFound, got %v", err)
	}

	// Test room capacity
	room := CreateRoom()

	// Test empty room
	if err := CanJoinRoom(room.RoomId); err != nil {
		t.Errorf("Expected no error for empty room, got %v", err)
	}

	// Fill room to capacity

	// Test full room
	if err := CanJoinRoom(room.RoomId); err != ErrRoomFull {
		t.Errorf("Expected ErrRoomFull, got %v", err)
	}
}

func TestRemoveRoom(t *testing.T) {
	room := CreateRoom()
	RemoveRoom(room.RoomId)

	if _, exists := GetRoom(room.RoomId); exists {
		t.Error("Expected room to be removed")
	}
}
