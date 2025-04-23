package game

import (
	"log"
	datastructures "skribble-backend/internals/data-structures"

	"github.com/google/uuid"
)

type Room struct {
	GameState       string
	Admin           *Client
	RoomId          string
	Clients         map[*Client]bool
	Game            *Game
	playerQueue     *datastructures.Queue[*Client]
	CurrentPlayer   *Client
	Register        chan *Client
	Unregister      chan *Client
	ChatBroadcast   chan ChatMessagePayload
	CanvasBroadcast chan CanvasMessagePayload
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
		Game:            NewGame(),
		GameState:       "setup",
	}
}

func (r *Room) run() {
	for {
		select {
		case client := <-r.Register:
			r.Clients[client] = true
			// if the player is first make it admin and set him the current player
			if r.playerQueue.IsEmpty() {
				r.Admin = client
				r.CurrentPlayer = client
			}
			r.playerQueue.Enqueue(client)
			log.Printf("Client added to room %s", r.RoomId)

		case client := <-r.Unregister:
			// TODO: enqueue the player from queue
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
