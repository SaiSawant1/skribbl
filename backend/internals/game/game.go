package game

type Game struct {
	Word         string
	CurrentRound int
	MaxRoundes   int
	MaxPlayer    int
	WordLength   int
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
