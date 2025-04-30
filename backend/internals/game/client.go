package game

import (
	"encoding/json"
	"log"
	"math/rand"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	UserName      string `json:"userName"`
	Conn          *websocket.Conn
	ChatSend      chan ChatMessagePayload
	CanvasSend    chan CanvasMessagePayload
	GameStateSend chan GameStateMessage
	Room          *Room
}

func NewClient(conn *websocket.Conn, room *Room, userName string) *Client {
	return &Client{
		UserName:      userName,
		Conn:          conn,
		ChatSend:      make(chan ChatMessagePayload, 256),
		CanvasSend:    make(chan CanvasMessagePayload, 256),
		GameStateSend: make(chan GameStateMessage, 256),
		Room:          room,
	}
}

func (c *Client) Read() {
	defer func() {
		c.Room.Unregister <- c
		c.Conn.Close()
	}()

	// Set read deadline to detect stale connections
	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, msg, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket read error: %v", err)
			}
			break
		}
		var basePayload BasePayload
		if err := json.Unmarshal(msg, &basePayload); err != nil {
			log.Printf("Failed to parse the message")
			break
		}

		if basePayload.Type == "chat" {
			c.Room.ChatBroadcast <- basePayload.ConvertMessageToChatPayload(msg)
		} else {
			c.Room.CanvasBroadcast <- basePayload.ConvertMessageToCanvasPayload(msg)

		}

	}
}

func (c *Client) Write() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case msg, ok := <-c.ChatSend:
			if !ok {
				// Channel was closed
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.Conn.WriteJSON(msg); err != nil {
				log.Printf("WebSocket write error: %v", err)
				return
			}
		case msg, ok := <-c.CanvasSend:
			if !ok {
				// Channel was closed
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.Conn.WriteJSON(msg); err != nil {
				log.Printf("WebSocket write error: %v", err)
				return
			}
		case msg, ok := <-c.GameStateSend:
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			msg.Word = maskWords(msg.Word, int(msg.WordLength/2))

			if err := c.Conn.WriteJSON(msg); err != nil {
				log.Printf("WebSocket write error: %v", err)
				return

			}
		case <-ticker.C:
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func maskWords(word string, length int) string {
	if len(word) == 0 {
		return word
	}
	wordRunes := []rune(word)

	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	v := r.Perm(len(wordRunes))[:length]

	for _, idx := range v {
		wordRunes[idx] = '_'
	}

	return string(wordRunes)
}
