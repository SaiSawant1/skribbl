package game

import (
	"log"

	"github.com/google/uuid"
)

type Room struct {
	RoomId          string
	Clients         map[*Client]bool
	ChatBroadcast   chan ChatMessagePayload
	CanvasBroadcast chan CanvasMessagePayload
	Register        chan *Client
	Unregister      chan *Client
}

func NewRoom() *Room {
	id := uuid.New().String()
	return &Room{
		RoomId:          id,
		Clients:         make(map[*Client]bool),
		ChatBroadcast:   make(chan ChatMessagePayload),
		CanvasBroadcast: make(chan CanvasMessagePayload),
		Register:        make(chan *Client),
		Unregister:      make(chan *Client),
	}
}

func (r *Room) run() {
	for {
		select {
		case client := <-r.Register:
			r.Clients[client] = true
			log.Printf("Client added to room %s", r.RoomId)
		case client := <-r.Unregister:
			delete(r.Clients, client)
			close(client.ChatSend)
			close(client.CanvasSend)
			if len(r.Clients) == 0 {
				RemoveRoom(r.RoomId)
			}
		case msg := <-r.ChatBroadcast:
			for client := range r.Clients {
				client.ChatSend <- msg
			}
		case msg := <-r.CanvasBroadcast:
			for client := range r.Clients {
				if client.UserName != msg.UserName {
					client.CanvasSend <- msg
				}
			}
		}
	}
}
