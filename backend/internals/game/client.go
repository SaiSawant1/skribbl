package game

import (
	"encoding/json"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	UserName   string `json:"userName"`
	Conn       *websocket.Conn
	ChatSend   chan ChatMessagePayload
	CanvasSend chan CanvasMessagePayload
	Room       *Room
}

func NewClient(conn *websocket.Conn, room *Room, userName string) *Client {
	return &Client{
		UserName:   userName,
		Conn:       conn,
		ChatSend:   make(chan ChatMessagePayload, 256), // Buffered channel to prevent blocking
		CanvasSend: make(chan CanvasMessagePayload, 256),
		Room:       room,
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

		// Process the message
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
		case <-ticker.C:
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
