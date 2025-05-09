"use client";

import { Ref } from "react";

interface WebSocketCanvasProps {
  canvasref: Ref<HTMLCanvasElement>;
}
export const WebSocketCanvas = ({ canvasref }: WebSocketCanvasProps) => {
  return (
    <canvas
      className="bg-white h-full rounded-lg cursor-pointer"
      ref={canvasref}
    />
  );
};
