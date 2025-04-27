"use client";

import { useState } from "react";
import { ConfigureForm } from "./configure-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ConfigureDialogProps {
  isAdmin: boolean;
}

export const ConfigureDialog = ({ isAdmin }: ConfigureDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const closeForm = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen && isAdmin}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Configure the Game
          </DialogTitle>
        </DialogHeader>
        <ConfigureForm closeForm={closeForm} />
      </DialogContent>
    </Dialog>
  );
};
