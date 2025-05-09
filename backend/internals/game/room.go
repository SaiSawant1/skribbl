package game

import (
	"log"

	"github.com/google/uuid"
)

type Room struct {
	CorrectGuess        int
	ScorePool           int32
	GameState           string
	Admin               *Client
	RoomId              string
	Clients             map[*Client]bool
	Game                *Game
	PlayerQueue         []*Client
	CurrentPlayer       *Client
	Register            chan *Client
	Unregister          chan *Client
	ChatBroadcast       chan ChatMessagePayload
	CanvasBroadcast     chan CanvasMessagePayload
	GamestateBroadcast  chan GameStateMessage
	PlayerRankBroadcast chan PlayerRankMessage
}

func NewRoom() *Room {
	id := uuid.New().String()
	return &Room{
		ScorePool:           100,
		RoomId:              id,
		Clients:             make(map[*Client]bool),
		Game:                NewGame(),
		GameState:           "WAITING",
		PlayerQueue:         make([]*Client, 0),
		ChatBroadcast:       make(chan ChatMessagePayload),
		CanvasBroadcast:     make(chan CanvasMessagePayload),
		Register:            make(chan *Client),
		Unregister:          make(chan *Client),
		GamestateBroadcast:  make(chan GameStateMessage, 250),
		PlayerRankBroadcast: make(chan PlayerRankMessage),
	}
}

func (r *Room) run() {
	for {
		select {
		case client := <-r.Register:

			if r.Clients[client] == false {

				r.Clients[client] = true
				if len(r.PlayerQueue) == 0 {
					r.Admin = client
					r.CurrentPlayer = client
				}

				r.PlayerQueue = append(r.PlayerQueue, client)
				log.Printf("Client added to room %s", r.RoomId)

				r.GamestateBroadcast <- GameStateMessage{
					CurrentPlayer: r.CurrentPlayer.UserName,
					RoomId:        r.RoomId,
					MaxPlayers:    r.Game.MaxPlayers,
					MaxRounds:     r.Game.MaxRounds,
					CurrentRound:  r.Game.CurrentRound,
					WordLength:    r.Game.WordLength,
					Type:          "game:state",
					GameState:     r.GameState,
					AdminUserName: r.Admin.UserName,
				}

				if r.GameState == "WAITING" {
					go r.SendPositions()
				}

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

			scoreUpdated := false
			isCorrectGuess := CheckWord(msg.Data.Message, r)

			if isCorrectGuess {
				r.CorrectGuess += 1

				modifiedMsg := msg
				modifiedMsg.Data.Message = "YOUR GUESS WAS CORRECT"

				for client := range r.Clients {
					if msg.UserName == client.UserName {
						client.Score = client.Score + 100
						scoreUpdated = true
						client.ChatSend <- modifiedMsg
					} else {
						notificationMsg := msg
						notificationMsg.Data.Message = msg.UserName + " guessed correctly!"
						client.ChatSend <- notificationMsg
					}
				}
			} else {
				for client := range r.Clients {
					client.ChatSend <- msg
				}
			}

			if r.CorrectGuess == len(r.Clients)-1 && r.GameState == "START" {
				r.GameState = "WAITING"
				go ChangeTurn(r)
			}

			if scoreUpdated {
				go r.SendPositions()
			}

		case msg := <-r.CanvasBroadcast:
			for client := range r.Clients {
				if client.UserName != msg.UserName {
					client.CanvasSend <- msg
				}
			}
		case msg := <-r.GamestateBroadcast:
			for client := range r.Clients {
				client.GameStateSend <- msg
			}

		case msg := <-r.PlayerRankBroadcast:
			for client := range r.Clients {

				client.RankSend <- msg
			}

		}

	}
}

func (r *Room) SendPositions() {
	mu.Lock()
	defer mu.Unlock()
	positions := make([]PlayerCurrentStats, 0, len(r.Clients))

	for client := range r.Clients {
		positions = append(positions, PlayerCurrentStats{
			UserName: client.UserName,
			Score:    client.Score,
		})
	}

	r.PlayerRankBroadcast <- PlayerRankMessage{
		Type:      "player:rank",
		Positions: positions,
	}
}
