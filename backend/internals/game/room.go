package game

import (
	"github.com/google/uuid"
)

type Room struct {
	RoomId     string
	Clients    map[*Client]bool
	Broadcast  chan Message
	Register   chan *Client
	Unregister chan *Client
}

func NewRoom() *Room {
	id := uuid.New().String()
	return &Room{
		RoomId:     id,
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
	}
}

func (r *Room) run() {
	for {
		select {
		case client := <-r.Register:
			r.Clients[client] = true
		case client := <-r.Unregister:
			delete(r.Clients, client)
			close(client.Send)
			if len(r.Clients) == 0 {
				RemoveRoom(r.RoomId)
			}
		case msg := <-r.Broadcast:
			for client := range r.Clients {
				if client.UserName != msg.UserName {
					client.Send <- msg
				}
			}
		}
	}
}
