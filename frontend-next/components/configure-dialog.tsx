"use client";

import { ConfigureForm } from "./configure-form";
import { useGameStore } from "./game-store-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ConfigureDialogProps {
  isOpen: boolean;
}

export const ConfigureDialog = ({ isOpen }: ConfigureDialogProps) => {
  const { gameState } = useGameStore((state) => state);
  return (
    <Dialog open={isOpen && gameState === "WAITING"}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Configure the Game
          </DialogTitle>
        </DialogHeader>
        <ConfigureForm />
      </DialogContent>
    </Dialog>
  );
};
