package game

import (
	"log"
	datastructures "skribble-backend/internals/data-structures"

	"github.com/google/uuid"
)

type Room struct {
	ScorePool          int32
	GameState          string
	Admin              *Client
	RoomId             string
	Clients            map[*Client]bool
	Game               *Game
	playerQueue        *datastructures.Queue[*Client]
	CurrentPlayer      *Client
	Register           chan *Client
	Unregister         chan *Client
	ChatBroadcast      chan ChatMessagePayload
	CanvasBroadcast    chan CanvasMessagePayload
	GamestateBroadcast chan GameStateMessage
}

func NewRoom() *Room {
	id := uuid.New().String()
	return &Room{
		ScorePool:          100,
		RoomId:             id,
		Clients:            make(map[*Client]bool),
		Game:               NewGame(),
		GameState:          "WAITING",
		playerQueue:        datastructures.NewQueue[*Client](),
		ChatBroadcast:      make(chan ChatMessagePayload),
		CanvasBroadcast:    make(chan CanvasMessagePayload),
		Register:           make(chan *Client),
		Unregister:         make(chan *Client),
		GamestateBroadcast: make(chan GameStateMessage),
	}
}

func (r *Room) run() {
	for {
		select {
		case client := <-r.Register:
			if r.Clients[client] == false {
				r.Clients[client] = true
				// if the player is first make it admin and set him the current player
				if r.playerQueue.IsEmpty() {
					r.Admin = client
					r.CurrentPlayer = client
				}
				r.playerQueue.Enqueue(client)
				log.Printf("Client added to room %s", r.RoomId)

			} else {
				log.Printf("Client[ %s ] already added to room %s", client.UserName, r.RoomId)
			}

		case client := <-r.Unregister:
			// TODO: enqueue the player from queue
			delete(r.Clients, client)
			close(client.ChatSend)
			close(client.CanvasSend)
			close(client.GameStateSend)
			log.Printf("REMOVING CLIENT %s \n", client.UserName)
			if len(r.Clients) == 0 {
				RemoveRoom(r.RoomId)
			}

		case msg := <-r.ChatBroadcast:
			for client := range r.Clients {
				// check if message data has answer
				isCorrectGuess := CheckWord(msg.Data.Message, r)
				if isCorrectGuess {
					client.Score += int(r.ScorePool)
					msg.Data.Message = "YOUR GUESS WAS CORRECT"
				}
				client.ChatSend <- msg
			}

		case msg := <-r.CanvasBroadcast:
			for client := range r.Clients {
				if client.UserName != msg.UserName {
					client.CanvasSend <- msg
				}
			}
		case msg := <-r.GamestateBroadcast:
			for client := range r.Clients {
				if client.UserName != msg.CurrentPlayer {
					client.GameStateSend <- msg
				}
			}
		}
	}
}
