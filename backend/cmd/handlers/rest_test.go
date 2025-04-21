package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateRoom(t *testing.T) {
	req, err := http.NewRequest("POST", "/api/create-room", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(CreateRoom)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	var response CreateRoomResponse
	if err := json.NewDecoder(rr.Body).Decode(&response); err != nil {
		t.Fatal(err)
	}

	if response.RoomId == "" {
		t.Error("Expected non-empty room ID")
	}
}

func TestJoinRoom(t *testing.T) {
	// First create a room
	roomReq, _ := http.NewRequest("POST", "/api/create-room", nil)
	roomRR := httptest.NewRecorder()
	CreateRoom(roomRR, roomReq)

	var roomResponse CreateRoomResponse
	json.NewDecoder(roomRR.Body).Decode(&roomResponse)

	// Test cases
	tests := []struct {
		name           string
		requestBody    JoinRoomRequest
		expectedStatus int
	}{
		{
			name: "Valid join request",
			requestBody: JoinRoomRequest{
				RoomId:   roomResponse.RoomId,
				UserName: "test-user",
			},
			expectedStatus: http.StatusOK,
		},
		{
			name: "Non-existent room",
			requestBody: JoinRoomRequest{
				RoomId:   "non-existent",
				UserName: "test-user",
			},
			expectedStatus: http.StatusNotFound,
		},
		{
			name: "Missing room ID",
			requestBody: JoinRoomRequest{
				UserName: "test-user",
			},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name: "Missing username",
			requestBody: JoinRoomRequest{
				RoomId: roomResponse.RoomId,
			},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.requestBody)
			req, _ := http.NewRequest("POST", "/api/join-room", bytes.NewBuffer(body))
			rr := httptest.NewRecorder()
			handler := http.HandlerFunc(JoinRoom)

			handler.ServeHTTP(rr, req)

			if status := rr.Code; status != tt.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v",
					status, tt.expectedStatus)
			}
		})
	}
}
