package game

import (
	"encoding/json"
	"time"
)

type Message struct {
	UserName string          `json:"userName"`
	Data     json.RawMessage `json:"data"`
	Type     string          `json:"type"`
}

type DrawPayload struct {
	X     float64 `json:"x"`
	Y     float64 `json:"Y"`
	Color string  `json:"color"`
	Tool  string  `json:"tool"`
	Size  float64 `json:"size"`
}

type GuessPayload struct {
	UserName string    `json:"userName"`
	Message  string    `json:"message"`
	Time     time.Time `json:"time"`
}
