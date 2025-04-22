"use client";

import { ModeToggle } from "./ui/mode-toggle";

export const NavBar = () => {
  return (
    <div className="w-full p-4 text-white text-center flex justify-between">
      <h1 className="text-3xl md:text-2xl font-bold bg-clip-text bg-gradient-to-r from-blue-700 text-blue-500/70">
        DoodleDuel
      </h1>
      <ModeToggle />
    </div>
  );
};
