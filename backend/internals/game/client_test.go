package game

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func TestNewClient(t *testing.T) {
	// Create a test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			t.Fatalf("Failed to upgrade connection: %v", err)
		}
		defer conn.Close()
	}))
	defer server.Close()

	// Convert http:// to ws://
	wsURL := "ws" + server.URL[4:]
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to dial: %v", err)
	}
	defer conn.Close()

	room := CreateRoom()
	client := NewClient(conn, room, "test-user")

	if client.UserName != "test-user" {
		t.Errorf("Expected username to be 'test-user', got %s", client.UserName)
	}

	if client.Room != room {
		t.Error("Expected client to be assigned to the correct room")
	}

	if cap(client.ChatSend) != 256 {
		t.Errorf("Expected chat send channel capacity to be 256, got %d", cap(client.ChatSend))
	}

	if cap(client.CanvasSend) != 256 {
		t.Errorf("Expected canvas send channel capacity to be 256, got %d", cap(client.CanvasSend))
	}
}

func TestClientReadWrite(t *testing.T) {
	// Create a test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{}
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			t.Fatalf("Failed to upgrade connection: %v", err)
		}
		defer conn.Close()

		// Send a test chat message
		chatMsg := ChatMessagePayload{
			UserName: "test-user",
			Type:     "chat",
			Data: ChatData{
				UserName: "test-user",
				Message:  "Hello!",
				Time:     time.Now(),
			},
		}
		if err := conn.WriteJSON(chatMsg); err != nil {
			t.Errorf("Failed to write chat message: %v", err)
		}

		// Send a test canvas message
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
		if err := conn.WriteJSON(canvasMsg); err != nil {
			t.Errorf("Failed to write canvas message: %v", err)
		}
	}))
	defer server.Close()

	// Convert http:// to ws://
	wsURL := "ws" + server.URL[4:]
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to dial: %v", err)
	}
	defer conn.Close()

	room := CreateRoom()
	client := NewClient(conn, room, "test-user")

	// Start read and write goroutines
	go client.Read()
	go client.Write()

	// Wait for messages to be processed
	time.Sleep(100 * time.Millisecond)

	// Verify chat message was processed
	select {
	case msg := <-room.ChatBroadcast:
		if msg.UserName != "test-user" {
			t.Errorf("Expected username to be 'test-user', got %s", msg.UserName)
		}
		if msg.Data.Message != "Hello!" {
			t.Errorf("Expected message to be 'Hello!', got %s", msg.Data.Message)
		}
	default:
		t.Error("Expected chat message to be broadcasted to room")
	}

	// Verify canvas message was processed
	select {
	case msg := <-room.CanvasBroadcast:
		if msg.UserName != "test-user" {
			t.Errorf("Expected username to be 'test-user', got %s", msg.UserName)
		}
		if msg.Data.X != 100 {
			t.Errorf("Expected X to be 100, got %f", msg.Data.X)
		}
	default:
		t.Error("Expected canvas message to be broadcasted to room")
	}
}
