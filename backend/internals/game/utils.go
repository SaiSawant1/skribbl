package game

import "strings"

func CheckWord(sentence string, room *Room) bool {
	words := strings.Fields(sentence)

	for _, word := range words {
		if strings.ToUpper(word) == room.Game.Word {
			return true
		}
	}
	return false
}
