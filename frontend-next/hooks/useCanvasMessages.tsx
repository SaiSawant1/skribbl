"use client";

import { useMessageStore } from "@/components/chat-message-store-provider";
import { useCallback, useEffect, useRef, useState } from "react";

export const useCanvasMessage = () => {
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const { canvasMessage } = useMessageStore((state) => state);

  // Current stroke properties
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentWidth, setCurrentWidth] = useState(2);

  // Initialize canvas when it's available
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Set canvas dimensions
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    canvas.style.width = `${parent.clientWidth}px`;
    canvas.style.height = `${parent.clientHeight}px`;

    // Setup context
    const context = canvas.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = currentColor;
      context.lineWidth = currentWidth;
      contextRef.current = context;
    }
  }, [currentColor, currentWidth]);

  const onStart = useCallback(
    (x: number, y: number, size?: number, color?: string): void => {
      setIsDrawingActive(true);

      const context = contextRef.current;
      if (!context) return;

      // Update stroke properties if provided
      if (color) {
        setCurrentColor(color);
        context.strokeStyle = color;
      }

      if (size) {
        setCurrentWidth(size);
        context.lineWidth = size;
      }

      context.beginPath();
      context.moveTo(x, y);
    },
    [],
  );

  const draw = useCallback((x: number, y: number): void => {
    if (!isDrawingActive) return;

    const context = contextRef.current;
    if (!context) return;

    context.lineTo(x, y);
    context.stroke();
  }, [isDrawingActive]);

  const onEnd = useCallback((): void => {
    setIsDrawingActive(false);

    const context = contextRef.current;
    if (!context) return;

    context.closePath();
  }, []);

  const clearCanvas = useCallback((): void => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Handle incoming WebSocket canvas messages
  useEffect((): void => {
    if (!canvasMessage?.data) return;

    switch (canvasMessage.data.type) {
      case "STARTDRAWING":
        onStart(
          canvasMessage.data.x,
          canvasMessage.data.y,
          canvasMessage.data.size,
        );
        break;

      case "DRAWING":
        draw(canvasMessage.data.x, canvasMessage.data.y);
        break;

      case "ENDDRAWING":
        onEnd();
        break;

      case "TOOL":
        if (!contextRef.current) return;

        // Handle tool changes (color or width)

        if (canvasMessage.data.size) {
          setCurrentWidth(canvasMessage.data.size);
          contextRef.current.lineWidth = canvasMessage.data.size;
        }
        break;

      case "CLEAR":
        clearCanvas();
        break;

      default:
        break;
    }
  }, [canvasMessage, draw, onEnd, onStart, clearCanvas]);

  return { isDrawingActive, canvasRef, contextRef, currentColor, currentWidth };
};
