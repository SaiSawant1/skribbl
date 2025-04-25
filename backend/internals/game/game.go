package game

type Game struct {
	Word         string
	CurrentRound uint
	MaxRounds    uint
	MaxPlayers   uint
	WordLength   uint
}

func NewGame() *Game {
	return &Game{
		Word:         "",
		CurrentRound: 0,
		MaxRounds:    5,
		MaxPlayers:   8,
		WordLength:   4,
	}
}
