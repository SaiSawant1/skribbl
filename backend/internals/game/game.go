package game

type Game struct {
	Word       string
	Round      int
	MaxRoundes int
}

func NewGame() *Game {
	return &Game{
		Word:       "",
		Round:      0,
		MaxRoundes: 5,
	}
}
