"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ConfigureFormScheam } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import axios from "axios";
import { useUserStore } from "./user-store-provider";
import { useParams } from "next/navigation";
import { GameStore } from "@/store/gameStore";
import { useGameStore } from "./game-store-provider";

export const ConfigureForm = () => {
  const { roomId } = useParams();
  const { userName } = useUserStore((state) => state);
  const { setInfo } = useGameStore((state: GameStore) => state);
  const form = useForm<z.infer<typeof ConfigureFormScheam>>({
    resolver: zodResolver(ConfigureFormScheam),
    defaultValues: {
      maxPlayers: 4,
      wordLength: 4,
      maxRounds: 4,
    },
  });

  const onSubmit = async (data: z.infer<typeof ConfigureFormScheam>) => {
    const resp = await axios.post(`http://localhost:8080/${roomId}/configure`, {
      maxPlayers: data.maxPlayers,
      wordLength: data.wordLength,
      maxRounds: data.maxRounds,
      roomId: roomId,
      userName: userName,
    });
    console.log(resp.data);
    setInfo(resp.data);
  };

  return (
    <Card className="relative overflow-hidden p-6">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full -translate-x-12 -translate-y-12 opacity-20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-900 rounded-full translate-x-16 translate-y-16 opacity-20" />

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
          Configure Game Settings
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="maxPlayers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Maximum Players
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={4}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="wordLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Word Length
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={4}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxRounds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Maximum Rounds
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={4}
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="default"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
              >
                Start Game
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500" />
    </Card>
  );
};
