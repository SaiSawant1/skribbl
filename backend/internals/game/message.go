package game

import (
	"encoding/json"
	"log"
	"time"
)

type BasePayload struct {
	UserName string          `json:"userName"`
	Data     json.RawMessage `json:"data"`
	Type     string          `json:"type"`
	IsHidden bool            `json:"isHidden"`
}

type ChatData struct {
	UserName string    `json:"userName"`
	Message  string    `json:"message"`
	Time     time.Time `json:"time"`
}

type CanvasData struct {
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
	Type  string  `json:"type"`
	Color string  `json:"color"`
	Tool  string  `json:"tool"`
	Size  float64 `json:"size"`
}

type ChatMessagePayload struct {
	UserName string   `json:"userName"`
	Data     ChatData `json:"data"`
	Type     string   `json:"type"`
	IsHidden bool     `json:"isHidden"`
}

type CanvasMessagePayload struct {
	UserName string     `json:"userName"`
	Data     CanvasData `json:"data"`
	Type     string     `json:"type"`
	IsHidden bool       `json:"isHidden"`
}

// Server Messages to control the game
type BaseServerMessage struct {
	Type  string          `json:"type"`
	Data  json.RawMessage `json:"data"`
	event string
}

type PickWordData struct {
	Words []string `json:"words"`
}

type PickWordPayload struct {
	Type     string       `json:"type"`
	Data     PickWordData `json:"data"`
	UserName string       `json:"userName"`
}

// serrver message Base

type GameStateMessage struct {
	AdminUserName string `json:"adminUserName"`
	Word          string `json:"word"`
	Type          string `json:"type"`
	CurrentPlayer string `json:"currentPlayer"`
	RoomId        string `json:"roomId"`
	MaxPlayers    uint   `json:"maxPlayers"`
	CurrentRound  uint   `json:"currentRound"`
	MaxRounds     uint   `json:"maxRounds"`
	WordLength    uint   `json:"wordLength"`
	GameState     string `json:"gameState"`
}

func (m *BasePayload) ConvertMessageToChatPayload(p []byte) ChatMessagePayload {
	var chatMessagePayload ChatMessagePayload
	if err := json.Unmarshal(p, &chatMessagePayload); err != nil {
		log.Printf("Failed to parse the chat message")
	}
	return chatMessagePayload
}
func (m *BasePayload) ConvertMessageToCanvasPayload(p []byte) CanvasMessagePayload {
	var canvasMessagePayload CanvasMessagePayload
	if err := json.Unmarshal(p, &canvasMessagePayload); err != nil {
		log.Printf("Failed to parse the canvas message")
	}
	return canvasMessagePayload
}
