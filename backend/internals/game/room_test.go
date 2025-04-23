package game

import (
	"testing"
	"time"
)

func TestNewRoom(t *testing.T) {
	room := CreateRoom()

	if room == nil {
		t.Error("Expected room to be created")
	}

	if room.Clients == nil {
		t.Error("Expected clients map to be initialized")
	}

	if cap(room.ChatBroadcast) != 256 {
		t.Errorf("Expected chat broadcast channel capacity to be 256, got %d", cap(room.ChatBroadcast))
	}

	if cap(room.CanvasBroadcast) != 256 {
		t.Errorf("Expected canvas broadcast channel capacity to be 256, got %d", cap(room.CanvasBroadcast))
	}

	if cap(room.Register) != 256 {
		t.Errorf("Expected register channel capacity to be 256, got %d", cap(room.Register))
	}

	if cap(room.Unregister) != 256 {
		t.Errorf("Expected unregister channel capacity to be 256, got %d", cap(room.Unregister))
	}
}

func TestRoomRun(t *testing.T) {
	room := CreateRoom()
	go room.run()

	// Create a test client
	client := &Client{
		UserName: "test-user",
		Room:     room,
	}

	// Test registration
	room.Register <- client
	time.Sleep(100 * time.Millisecond)

	if len(room.Clients) != 1 {
		t.Errorf("Expected 1 client in room, got %d", len(room.Clients))
	}

	// Test unregistration
	room.Unregister <- client
	time.Sleep(100 * time.Millisecond)

	if len(room.Clients) != 0 {
		t.Errorf("Expected 0 clients in room, got %d", len(room.Clients))
	}

	// Test chat broadcast
	chatMsg := ChatMessagePayload{
		UserName: "test-user",
		Type:     "chat",
		Data: ChatData{
			UserName: "test-user",
			Message:  "Hello!",
			Time:     time.Now(),
		},
	}
	room.ChatBroadcast <- chatMsg
	time.Sleep(100 * time.Millisecond)

	// Test canvas broadcast
	canvasMsg := CanvasMessagePayload{
		UserName: "test-user",
		Type:     "canvas",
		Data: CanvasData{
			X:     100,
			Y:     100,
			Color: "#000000",
			Tool:  "pen",
			Size:  2,
		},
	}
	room.CanvasBroadcast <- canvasMsg
	time.Sleep(100 * time.Millisecond)
}
