"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "./user-store-provider";
import { WebSocketCanvas } from "./Canvas";
import { useCanvasMessage } from "@/hooks/useCanvasMessages";

interface DrawingCanvasProps {
  onMessageSend: (
    x: number,
    y: number,
    type: string,
    size: number,
    tool: string,
  ) => void;
}

export default function DrawingCanvas({ onMessageSend }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentWidth, setCurrentWidth] = useState(2);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const { isGuessing } = useUserStore((state) => state);
  const { canvasRef: websocketCanvasRef } = useCanvasMessage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      canvas.style.width = `${parent.clientWidth}`;
      canvas.style.height = `${parent.clientHeight}`;
    }
    // Get context
    const context = canvas.getContext("2d");
    if (!context) return;
    context.lineCap = "round";
    context.lineJoin = "round";
    if (!contextRef.current) {
      contextRef.current = context;
    }
  }, []);

  useEffect(() => {
    if (!contextRef.current) {
      return;
    }
    contextRef.current.strokeStyle = currentColor;
    contextRef.current.lineWidth = currentWidth;
  }, [currentColor, currentWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawingActive(true);
    setPoints([{ x: offsetX, y: offsetY }]);
    onMessageSend(offsetX, offsetY, "STARTDRAWING", 2, "pencil");

    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingActive) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const newPoints = [...points, { x: offsetX, y: offsetY }];
    setPoints(newPoints);
    onMessageSend(offsetX, offsetY, "DRAWING", 2, "pencil");

    const context = contextRef.current;
    if (!context) return;

    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    setIsDrawingActive(false);
    setPoints([]);
    onMessageSend(0, 0, "ENDDRAWING", 2, "pencil");

    const context = contextRef.current;
    if (!context) return;
    context.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentColor(e.target.value);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentWidth(Number(e.target.value));
  };

  return (
    <div className="flex flex-col gap-4">
      {isGuessing === true
        ? <WebSocketCanvas canvasref={websocketCanvasRef} />
        : (
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            className="bg-white rounded-lg cursor-pointer"
          />
        )}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="color" className="text-sm font-medium">
              Color:
            </label>
            <input
              type="color"
              id="color"
              value={currentColor}
              onChange={handleColorChange}
              className="w-8 h-8 p-0 border-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="width" className="text-sm font-medium">
              Width:
            </label>
            <input
              type="range"
              id="width"
              min="1"
              max="20"
              value={currentWidth}
              onChange={handleWidthChange}
              className="w-32"
            />
            <span className="text-sm">{currentWidth}px</span>
          </div>
        </div>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
