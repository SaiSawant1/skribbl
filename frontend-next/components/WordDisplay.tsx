"use client";

import { useGameStore } from "./game-store-provider";
import { useUserStore } from "./user-store-provider";
import { Button } from "./ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

export default function WordDisplay() {
  const {
    gameState,
    word,
    setWord,
    roomId,
    currentPlayer,
    setGameState,
    wordLength,
  } = useGameStore((
    state,
  ) => state);

  const { userName } = useUserStore((state) => state);
  const [wordOptions, setWordOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (wordLength && currentPlayer === userName) {
        const resp = await axios.get(
          `https://random-word-api.vercel.app/api?words=3&length=${wordLength}`,
        );
        console.log(resp.data);
        setWordOptions(resp.data);
      }
    };
    fetchData();
  }, [currentPlayer, userName, wordLength]);

  const displayWord = (word: string) => {
    if (word !== "") {
      return word;
    } else if (gameState === "WAITING") {
      return "Player is picking word.";
    }
  };

  const onWordSelect = async (word: string) => {
    const resp = await axios.post(`http://localhost:8080/${roomId}/word`, {
      userName: userName,
      roomId: roomId,
      word: word,
    });
    if (resp.status === 200) {
      setWord(word);
      setGameState("START");
    }
  };

  return (
    <>
      {gameState === "WAITING" && (currentPlayer == userName)
        ? (
          <>
            <div className="mb-4">
              <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full -translate-x-12 -translate-y-12 opacity-20" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-900 rounded-full translate-x-16 translate-y-16 opacity-20" />

                <div className="relative z-10">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                    Choose a Word to Draw
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {wordOptions.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        onClick={() => {
                          onWordSelect(option);
                        }}
                        className="h-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:from-blue-100 hover:to-purple-100 dark:hover:from-gray-700 dark:hover:to-gray-600"
                      >
                        <span className="text-2xl font-mono text-blue-600 dark:text-blue-400 tracking-wider">
                          {option}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Bottom border accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
              </div>
            </div>
          </>
        )
        : (
          <>
            <div className="mb-4">
              <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full -translate-x-12 -translate-y-12 opacity-20" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-900 rounded-full translate-x-16 translate-y-16 opacity-20" />

                <div className="relative z-10">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                    {!(currentPlayer == userName) ? "GUESS THE WORD" : "DRAW"}
                  </h2>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-inner">
                    <div className="text-3xl font-mono text-center text-blue-600 dark:text-blue-400 tracking-wider">
                      {displayWord(word)}
                    </div>
                  </div>
                </div>

                {/* Bottom border accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
              </div>
            </div>
          </>
        )}
    </>
  );
}
