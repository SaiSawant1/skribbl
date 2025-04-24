package game

type Game struct {
	Word         string
	CurrentRound uint
	MaxRoundes   uint
	MaxPlayer    uint
	WordLength   uint
}

func NewGame() *Game {
	return &Game{
		Word:         "",
		CurrentRound: 0,
		MaxRoundes:   5,
		MaxPlayer:    8,
		WordLength:   4,
	}
}
