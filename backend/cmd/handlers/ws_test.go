package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"skribble-backend/internals/game"

	"github.com/gorilla/websocket"
)

func TestHandleWs(t *testing.T) {
	// Create a test room
	room := game.CreateRoom()

	// Create a test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		HandleWs(w, r)
	}))
	defer server.Close()

	// Test cases
	tests := []struct {
		name           string
		roomId         string
		userName       string
		expectedStatus int
	}{
		{
			name:           "Valid connection",
			roomId:         room.RoomId,
			userName:       "test-user",
			expectedStatus: http.StatusSwitchingProtocols,
		},
		{
			name:           "Non-existent room",
			roomId:         "non-existent",
			userName:       "test-user",
			expectedStatus: http.StatusNotFound,
		},
		{
			name:           "Missing room ID",
			roomId:         "",
			userName:       "test-user",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Missing username",
			roomId:         room.RoomId,
			userName:       "",
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Convert http:// to ws://
			wsURL := "ws" + server.URL[4:] + "/ws/" + tt.roomId + "?userName=" + tt.userName

			// Try to establish WebSocket connection
			_, resp, err := websocket.DefaultDialer.Dial(wsURL, nil)

			if tt.expectedStatus == http.StatusSwitchingProtocols {
				// For successful connections
				if err != nil {
					t.Errorf("Expected successful connection, got error: %v", err)
				}
				if resp.StatusCode != tt.expectedStatus {
					t.Errorf("Expected status %v, got %v", tt.expectedStatus, resp.StatusCode)
				}
			} else {
				// For failed connections
				if err == nil {
					t.Error("Expected connection to fail")
				}
				if resp.StatusCode != tt.expectedStatus {
					t.Errorf("Expected status %v, got %v", tt.expectedStatus, resp.StatusCode)
				}
			}
		})
	}
}

func TestWebSocketCommunication(t *testing.T) {
	// Create a test room
	room := game.CreateRoom()

	// Create a test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		HandleWs(w, r)
	}))
	defer server.Close()

	// Connect to WebSocket
	wsURL := "ws" + server.URL[4:] + "/ws/" + room.RoomId + "?userName=test-user"
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close()

	// Send a test message
	testMsg := game.Message{
		UserName: "test-user",
		Type:     "test",
		Data:     []byte(`{"test": "data"}`),
	}
	if err := conn.WriteJSON(testMsg); err != nil {
		t.Fatalf("Failed to write message: %v", err)
	}

	// Wait for message to be processed
	time.Sleep(100 * time.Millisecond)

	// Verify room received the message
	select {
	case msg := <-room.Broadcast:
		if msg.UserName != testMsg.UserName {
			t.Errorf("Expected username %s, got %s", testMsg.UserName, msg.UserName)
		}
		if msg.Type != testMsg.Type {
			t.Errorf("Expected type %s, got %s", testMsg.Type, msg.Type)
		}
	default:
		t.Error("Expected message to be broadcasted to room")
	}
}
