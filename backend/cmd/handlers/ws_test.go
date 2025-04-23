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
			roomId:         "test-room",
			userName:       "test-user",
			expectedStatus: http.StatusSwitchingProtocols,
		},
		{
			name:           "Missing room ID",
			roomId:         "",
			userName:       "test-user",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Missing username",
			roomId:         "test-room",
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
	// Create a test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		HandleWs(w, r)
	}))
	defer server.Close()

	// Connect to WebSocket
	wsURL := "ws" + server.URL[4:] + "/ws/test-room?userName=test-user"
	conn, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close()

	// Send a test chat message
	chatMsg := game.ChatMessagePayload{
		UserName: "test-user",
		Type:     "chat",
		Data: game.ChatData{
			UserName: "test-user",
			Message:  "Hello!",
			Time:     time.Now(),
		},
	}
	if err := conn.WriteJSON(chatMsg); err != nil {
		t.Fatalf("Failed to write chat message: %v", err)
	}

	// Send a test canvas message
	canvasMsg := game.CanvasMessagePayload{
		UserName: "test-user",
		Type:     "canvas",
		Data: game.CanvasData{
			X:     100,
			Y:     100,
			Color: "#000000",
			Tool:  "pen",
			Size:  2,
		},
	}
	if err := conn.WriteJSON(canvasMsg); err != nil {
		t.Fatalf("Failed to write canvas message: %v", err)
	}

	// Wait for messages to be processed
	time.Sleep(100 * time.Millisecond)

	// Get the room to verify messages were processed
	room, exists := game.GetRoom("test-room")
	if !exists {
		t.Fatal("Expected room to exist")
	}

	// Verify chat message was processed
	select {
	case msg := <-room.ChatBroadcast:
		if msg.UserName != chatMsg.UserName {
			t.Errorf("Expected username %s, got %s", chatMsg.UserName, msg.UserName)
		}
		if msg.Data.Message != chatMsg.Data.Message {
			t.Errorf("Expected message %s, got %s", chatMsg.Data.Message, msg.Data.Message)
		}
	default:
		t.Error("Expected chat message to be broadcasted to room")
	}

	// Verify canvas message was processed
	select {
	case msg := <-room.CanvasBroadcast:
		if msg.UserName != canvasMsg.UserName {
			t.Errorf("Expected username %s, got %s", canvasMsg.UserName, msg.UserName)
		}
		if msg.Data.X != canvasMsg.Data.X {
			t.Errorf("Expected X %f, got %f", canvasMsg.Data.X, msg.Data.X)
		}
	default:
		t.Error("Expected canvas message to be broadcasted to room")
	}
}
