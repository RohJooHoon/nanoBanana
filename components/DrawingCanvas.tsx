
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Icon } from './Icon';

interface DrawingCanvasProps {
  onDrawingChange: (dataUrl: string | null) => void;
  width?: number;
  height?: number;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawingChange, width = 500, height = 281 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  const getContext = useCallback(() => {
    return canvasRef.current?.getContext('2d');
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#1f2937'; // bg-gray-800
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      onDrawingChange(null);
      setHasDrawing(false);
    }
  }, [getContext, onDrawingChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const scale = window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
      }
    }
    clearCanvas();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);


  const getCoords = (event: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const touch = (event as React.TouchEvent).touches?.[0];

    const clientX = touch ? touch.clientX : (event as React.MouseEvent).clientX;
    const clientY = touch ? touch.clientY : (event as React.MouseEvent).clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const coords = getCoords(event);
    if (!coords) return;

    const ctx = getContext();
    if (ctx) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      setIsDrawing(true);
    }
  }, [getContext]);

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const coords = getCoords(event);
    if (!coords) return;

    const ctx = getContext();
    if (ctx) {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      setHasDrawing(true);
    }
  }, [isDrawing, getContext]);

  const stopDrawing = useCallback(() => {
    const ctx = getContext();
    if(ctx){
        ctx.closePath();
    }
    setIsDrawing(false);
    if (canvasRef.current && hasDrawing) {
        onDrawingChange(canvasRef.current.toDataURL('image/png'));
    }
  }, [getContext, hasDrawing, onDrawingChange]);

  return (
    <div className="relative w-full aspect-video">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-full bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg"
      />
      {hasDrawing && (
         <button
            onClick={clearCanvas}
            className="absolute top-2 right-2 py-1 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors z-10"
          >
           <Icon.Trash className="w-4 h-4" />
            Clear
        </button>
      )}
    </div>
  );
};
