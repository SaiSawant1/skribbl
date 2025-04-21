package game

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	UserName string `json:"userName"`
	Conn     *websocket.Conn
	Send     chan Message
	Room     *Room
}

func NewClient(conn *websocket.Conn, room *Room, userName string) *Client {
	return &Client{
		UserName: userName,
		Conn:     conn,
		Send:     make(chan Message, 256), // Buffered channel to prevent blocking
		Room:     room,
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
		var msg Message
		if err := c.Conn.ReadJSON(&msg); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket read error: %v", err)
			}
			break
		}

		// Process the message
		c.Room.Broadcast <- msg
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
		case msg, ok := <-c.Send:
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
