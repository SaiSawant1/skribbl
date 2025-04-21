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

	if cap(client.Send) != 256 {
		t.Errorf("Expected send channel capacity to be 256, got %d", cap(client.Send))
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

		// Send a test message
		msg := Message{
			UserName: "test-user",
			Type:     "test",
			Data:     []byte(`{"test": "data"}`),
		}
		if err := conn.WriteJSON(msg); err != nil {
			t.Errorf("Failed to write message: %v", err)
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

	// Wait for message to be processed
	time.Sleep(100 * time.Millisecond)

	// Verify room received the message
	select {
	case msg := <-room.Broadcast:
		if msg.UserName != "test-user" {
			t.Errorf("Expected username to be 'test-user', got %s", msg.UserName)
		}
		if msg.Type != "test" {
			t.Errorf("Expected type to be 'test', got %s", msg.Type)
		}
	default:
		t.Error("Expected message to be broadcasted to room")
	}
}
