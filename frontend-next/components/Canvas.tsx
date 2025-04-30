"use client";

import { Ref } from "react";

interface WebSocketCanvasProps {
  canvasref: Ref<HTMLCanvasElement>;
}
export const WebSocketCanvas = ({ canvasref }: WebSocketCanvasProps) => {
  return (
    <canvas className="bg-white rouded-lg cursor-pointer" ref={canvasref} />
  );
};
