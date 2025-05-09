"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/components/user-store-provider";
import { useGameStore } from "@/components/game-store-provider";

export default function StartPage() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const {
    userName,
    setUserName,
  } = useUserStore(
    (state) => state,
  );
  const { roomId, setRoomId } = useGameStore((state) => state);

  const onUserName = (e: ChangeEvent<HTMLInputElement>) => {
    setError(undefined);
    if (e.target.value) {
      const user = e.target.value;
      for (let i = 0; i < user.length; i++) {
        if (user[i] === " ") {
          setError("User Name Shouldn't have space");
          return;
        }
      }
      setUserName(e.target.value);
    }
  };
  const onRoomIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setRoomId(e.target.value);
    }
  };

  const onCreateRoom = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_GO_SERVER}/create-room`,
      {
        userName: userName,
      },
    );
    const roomId = res.data.roomId;
    if (roomId) {
      setRoomId(roomId);
      router.push(`/${roomId}`);
    }
  };
  const onJoinRoom = async () => {
    if (!userName) {
      setError("Please enter user Name");
      return;
    }
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_GO_SERVER}/join-room`,
      {
        roomId: roomId,
        userName: userName,
      },
    );
    if (userName && res.status === 200) {
      router.push(`/${roomId}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/50 backdrop-blur-sm rounded-xl">
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-white transition-colors mb-4"
        >
          ← Back to Home
        </button>

        <h2 className="text-3xl font-bold text-center text-violet-600">
          Join the Fun!
        </h2>

        <div className="space-y-4">
          <div className="text-blue-700 font-semibold text-xl">User Name</div>
          <Input
            className="text-violet-700 font-bold text-lg"
            onChange={(e) => onUserName(e)}
            placeholder="Enter your User Name"
          />
          <Button
            onClick={onCreateRoom}
            className="w-full font-semibold bg-violet-300 text-lg py-3 hover:bg-violet-500"
            disabled={error === undefined || userName === undefined
              ? false
              : true}
          >
            Start Game
          </Button>
          <hr />
          <div className="text-blue-700 font-semibold text-xl">ROOM ID</div>
          <Input
            className="text-violet-700 font-bold text-lg"
            onChange={(e) => onRoomIdChange(e)}
            placeholder="Enter your User Name"
          />
          <Button
            onClick={onJoinRoom}
            className="w-full font-semibold bg-emerald-300 text-lg py-3 hover:bg-emerald-500"
          >
            Join Game
          </Button>
          {error && (
            <div className="w-full bg-red-400 text-white text-center rounded-xl font-bold text-xl">
              {error}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
