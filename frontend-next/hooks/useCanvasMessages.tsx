"use client";

import { useMessageStore } from "@/components/chat-message-store-provider";
import { useCallback, useEffect, useRef, useState } from "react";

export const useCanvasMessage = () => {
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const { canvasMessage } = useMessageStore((state) => state);

  const onStart = useCallback((x: number, y: number): void => {
    setIsDrawingActive(true);

    const context = contextRef.current;
    if (!context) return;

    context.beginPath();
    context.moveTo(x, y);
  }, []);

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

  useEffect((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
    }

    // Get context
    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineCap = "round";
    context.lineJoin = "round";

    if (!contextRef.current) {
      contextRef.current = context;
    }

    contextRef.current.strokeStyle = "#000000";
    contextRef.current.lineWidth = 2;
  }, []);

  useEffect((): void => {
    if (!canvasMessage?.data) return;

    switch (canvasMessage.data.type) {
      case "STARTDRAWING":
        onStart(canvasMessage.data.x, canvasMessage.data.y);
        break;
      case "DRAWING":
        draw(canvasMessage.data.x, canvasMessage.data.y);
        break;
      case "ENDDRAWING":
        onEnd();
        break;
      case "TOOL":
        if (!contextRef.current) return;
        // Tool switching logic could go here
        break;
      default:
        break;
    }
  }, [canvasMessage, draw, onEnd, onStart]);

  return { isDrawingActive, canvasRef, contextRef };
};
