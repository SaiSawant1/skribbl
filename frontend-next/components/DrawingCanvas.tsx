"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "./user-store-provider";
import { useCanvasMessage } from "@/hooks/useCanvasMessages";

interface DrawingCanvasProps {
  onMessageSend: (
    x: number,
    y: number,
    type: string,
    size: number,
    color: string,
    tool: string,
  ) => void;
}

export default function DrawingCanvas({ onMessageSend }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentWidth, setCurrentWidth] = useState(2);
  const { isGuessing } = useUserStore((state) => state);
  const { canvasRef: websocketCanvasRef, contextRef: websocketContextRef } =
    useCanvasMessage();

  // Initialize both canvases
  useEffect(() => {
    const setupCanvas = (
      canvas: HTMLCanvasElement | null,
      contextRefToSet: React.MutableRefObject<CanvasRenderingContext2D | null>,
    ) => {
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      // Set the actual drawing surface size
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;

      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = currentColor;
        context.lineWidth = currentWidth;
        contextRefToSet.current = context;
      }
    };

    // Setup the main canvas
    setupCanvas(canvasRef.current, contextRef);

    // If websocketCanvasRef exists and we're guessing, initialize it too
    if (isGuessing && websocketCanvasRef.current) {
      setupCanvas(websocketCanvasRef.current, websocketContextRef);
    }
  }, [
    isGuessing,
    websocketCanvasRef,
    websocketContextRef,
    currentColor,
    currentWidth,
  ]);

  // Handle window resize for both canvases
  useEffect(() => {
    const resizeCanvas = () => {
      const resizeSingleCanvas = (
        canvas: HTMLCanvasElement | null,
        contextRefToSet: React.MutableRefObject<
          CanvasRenderingContext2D | null
        >,
      ) => {
        const parent = canvas?.parentElement;
        if (!canvas || !parent) return;

        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;

        // Reinitialize context properties
        if (contextRefToSet.current) {
          contextRefToSet.current.lineCap = "round";
          contextRefToSet.current.lineJoin = "round";
          contextRefToSet.current.strokeStyle = currentColor;
          contextRefToSet.current.lineWidth = currentWidth;
        }
      };

      // Resize both canvases
      resizeSingleCanvas(canvasRef.current, contextRef);
      if (isGuessing && websocketCanvasRef.current) {
        resizeSingleCanvas(websocketCanvasRef.current, websocketContextRef);
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // initial resize

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [
    currentColor,
    currentWidth,
    isGuessing,
    websocketCanvasRef,
    websocketContextRef,
  ]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isGuessing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawingActive(true);

    // Send message with current width and color
    onMessageSend(
      offsetX,
      offsetY,
      "STARTDRAWING",
      currentWidth,
      currentColor,
      "pencil",
    );

    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.strokeStyle = currentColor;
    context.lineWidth = currentWidth;
    context.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isGuessing || !isDrawingActive) return;

    const { offsetX, offsetY } = e.nativeEvent;

    // Send message with current width and color
    onMessageSend(
      offsetX,
      offsetY,
      "DRAWING",
      currentWidth,
      currentColor,
      "pencil",
    );

    const context = contextRef.current;
    if (!context) return;

    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    if (isGuessing) return;

    setIsDrawingActive(false);
    onMessageSend(0, 0, "ENDDRAWING", currentWidth, currentColor, "pencil");

    const context = contextRef.current;
    if (!context) return;
    context.closePath();
  };

  const clearCanvas = () => {
    // Clear the active canvas
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Send a clear message to synchronize
    onMessageSend(0, 0, "CLEAR", 0, "", "");
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);

    if (contextRef.current) {
      contextRef.current.strokeStyle = newColor;
    }

    // Notify about color change
    onMessageSend(0, 0, "TOOL", currentWidth, newColor, "color");
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setCurrentWidth(newWidth);

    if (contextRef.current) {
      contextRef.current.lineWidth = newWidth;
    }

    // Notify about width change
    onMessageSend(0, 0, "TOOL", newWidth, currentColor, "width");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-90">
        <canvas
          ref={isGuessing ? websocketCanvasRef : canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="bg-white rounded-lg cursor-pointer"
        />
      </div>

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
              disabled={isGuessing}
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
              disabled={isGuessing}
            />
            <span className="text-sm">{currentWidth}px</span>
          </div>
        </div>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          disabled={isGuessing}
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
