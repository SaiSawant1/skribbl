"use client";

import { ConfigureForm } from "./configure-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ConfigureDialogProps {
  isOpen: boolean;
}

export const ConfigureDialog = ({ isOpen }: ConfigureDialogProps) => {
  const onSubmit = () => {
    console.log("submit");
  };
  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Configure the Game
          </DialogTitle>
        </DialogHeader>
        <ConfigureForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
