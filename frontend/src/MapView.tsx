// import {
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useRef,
//   useState,
// } from "react";
// import type { MapImageDimensions, Point } from "./Shared/Interface";

// interface MapViewProps {
//   mapPath: string;
//   realDimensions: number[];
//   actualPath: Point[];
//   projectedPath: Point[];
//   pathColor?: string;
//   pathWidth?: number;
//   multiColor?: boolean;
//   maxSpeed?: number;
//   minSpeed?: number;
// }

// export default function MapView({
//   mapPath,
//   realDimensions,
//   actualPath,
//   projectedPath,
//   pathColor = "#ff0000",
//   pathWidth = 2,
//   multiColor = true,
//   maxSpeed = 170,
//   minSpeed = 1,
// }: MapViewProps) {
//   const MapRef = useRef<HTMLImageElement>(null);
//   const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
//   const projectedPathRef = useRef<HTMLCanvasElement | null>(null);
//   const [MapDimensions, setMapDimensions] = useState<
//     MapImageDimensions | undefined
//   >();
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const getColorForSpeed = useCallback(
//     (speed: number): string => {
//       if (!multiColor) return pathColor;
//       const normalizedSpeed = Math.max(
//         0,
//         Math.min(1, (speed - minSpeed) / (maxSpeed - minSpeed))
//       );
//       if (normalizedSpeed < 0.5) {
//         return `rgb(${Math.floor(normalizedSpeed * 2 * 255)}, 255, 0)`;
//       }
//       return `rgb(255, ${Math.floor((1 - normalizedSpeed) * 2 * 255)}, 0)`;
//     },
//     [multiColor, pathColor, maxSpeed, minSpeed]
//   );

//   const drawStoredPaths = useCallback(
//     (ctx: CanvasRenderingContext2D, positions: Point[]) => {
//       if (positions.length < 2 || !MapDimensions || !realDimensions) return;

//       ctx.beginPath();
//       ctx.moveTo(
//         (positions[0].x * MapDimensions?.width) / realDimensions[0],
//         MapDimensions.height -
//           (positions[0].y * MapDimensions?.height) / realDimensions[1]
//       );

//       for (let i = 1; i < positions.length; i++) {
//         const currentPoint = positions[i];
//         ctx.lineTo(
//           (currentPoint.x * MapDimensions?.width) / realDimensions[0],
//           MapDimensions.height -
//             (currentPoint.y * MapDimensions?.height) / realDimensions[1]
//         );

//         // Update color based on speed if multiColor is enabled
//         ctx.strokeStyle = getColorForSpeed(currentPoint.speed);
//         ctx.lineWidth = pathWidth;
//         ctx.stroke();

//         // Start a new path segment to allow for color changes
//         ctx.beginPath();
//         ctx.moveTo(
//           (currentPoint.x * MapDimensions?.width) / realDimensions[0],
//           MapDimensions.height -
//             (currentPoint.y * MapDimensions?.height) / realDimensions[1]
//         );
//       }
//     },
//     [MapDimensions, realDimensions, getColorForSpeed, pathWidth]
//   );

//   const updateCanvasDimensions = useCallback(
//     (width: number, height: number) => {
//       [drawingCanvasRef, projectedPathRef].forEach((ref) => {
//         if (ref.current) {
//           ref.current.width = width;
//           ref.current.height = height;
//           ref.current.style.width = `${width}px`;
//           ref.current.style.height = `${height}px`;
//         }
//       });
//     },
//     [drawingCanvasRef, projectedPathRef]
//   );

//   const handleImageLoad = useCallback(() => {
//     if (MapRef.current) {
//       const { width, height } = MapRef.current;
//       setMapDimensions({ width, height });
//       updateCanvasDimensions(width, height);
//     }
//   }, [MapRef, setMapDimensions, updateCanvasDimensions]);

//   const clearPath = useCallback(() => {
//     const canvas = drawingCanvasRef.current;
//     const canvas2 = projectedPathRef.current;
//     if (canvas) {
//       const ctx = canvas.getContext("2d");
//       if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
//     }
//     if (canvas2) {
//       const ctx2 = canvas2.getContext("2d");
//       if (ctx2) ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
//     }
//   }, [drawingCanvasRef, projectedPathRef]);

//   useLayoutEffect(() => {
//     setIsLoading(true);
//     const updateDimensions = () => {
//       if (MapRef.current) {
//         const { width, height } = MapRef.current;

//         // Update map dimensions and canvases
//         setMapDimensions({ width, height });
//         updateCanvasDimensions(width, height);
//       }
//       setIsLoading(false);
//     };

//     updateDimensions();
//     window.addEventListener("resize", updateDimensions);

//     return () => {
//       window.removeEventListener("resize", updateDimensions);
//     };
//   }, [MapRef, setMapDimensions, updateCanvasDimensions]);

//   useEffect(() => {
//     const handleCarStatusChange = () => {
//       if (!MapDimensions) return;
//       if (!isLoading || MapRef.current?.width || MapRef.current?.height) {
//         clearPath(); // Clear the current path

//         if (drawingCanvasRef.current) {
//           const ctx = drawingCanvasRef.current.getContext("2d");
//           if (ctx) {
//             // Draw the final stored paths to preserve the last tracking
//             drawStoredPaths(ctx, actualPath);
//           }
//         }
//         if (projectedPathRef.current) {
//           const ctx2 = projectedPathRef.current.getContext("2d");
//           if (ctx2) {
//             drawStoredPaths(ctx2, projectedPath);
//           }
//         }
//       }
//     };

//     handleCarStatusChange();
//   }, [
//     MapDimensions,
//     actualPath,
//     clearPath,
//     drawStoredPaths,
//     isLoading,
//     projectedPath,
//   ]);

//   return (
//     <div
//       className={`relative bg-white border-2 border-black flex justify-center items-center rounded-xl p-2`}
//       style={{
//         maxWidth: MapRef.current?.naturalWidth,
//         maxHeight: MapRef.current?.naturalHeight,
//       }}
//     >
//       {/* Map Image */}
//       <img
//         ref={MapRef}
//         src={mapPath}
//         className={`rounded-xl object-cover`}
//         style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
//         alt="Map Circuit"
//         onLoad={handleImageLoad}
//       />

//       {/* Projected Path Canvas */}
//       <canvas
//         ref={projectedPathRef}
//         className={`absolute z-13 rounded-xl pointer-events-none`}
//         style={{
//           width: `${MapRef.current?.width}`,
//           height: `${MapRef.current?.height}`,
//         }}
//       />

//       {/* Drawing Canvas */}
//       <canvas
//         ref={drawingCanvasRef}
//         className={`absolute z-10 rounded-xl pointer-events-none`}
//         style={{
//           width: `${MapRef.current?.width}`,
//           height: `${MapRef.current?.height}`,
//         }}
//       />

//       {/* Full Screen Toggle Button */}
//       {/* <button
//           className="top-4 left-4 absolute h-6 w-6 z-30 rounded-full flex justify-center items-center dark:bg-slate-50 bg-white "
//           onClick={toggleProjectedPath}
//         >
//           <img
//             className="h-3 w-3"
//             src={showProjectedPath ? "./ExitFullScreen.svg" : "./FullScreen.svg"}
//             alt={showProjectedPath ? "Exit Fullscreen" : "Enter Fullscreen"}
//           />
//         </button> */}
//     </div>
//   );
// }

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MapImageDimensions, Point } from "./Shared/Interface";

interface MapViewProps {
  mapPath: string;
  realDimensions: number[];
  actualPath: Point[];
  projectedPath: Point[];
  highlightPoint?: Point | null;
  pathColor?: string;
  pathWidth?: number;
  multiColor?: boolean;
  maxSpeed?: number;
  minSpeed?: number;
}

export default function MapView({
  mapPath,
  realDimensions,
  actualPath,
  projectedPath,
  highlightPoint,
  pathColor = "#ff0000",
  pathWidth = 2,
  multiColor = true,
  maxSpeed = 170,
  minSpeed = 1,
}: MapViewProps) {
  const MapRef = useRef<HTMLImageElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const projectedPathRef = useRef<HTMLCanvasElement>(null);
  const highlightCanvasRef = useRef<HTMLCanvasElement>(null);
  const [MapDimensions, setMapDimensions] = useState<MapImageDimensions>();
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log(projectedPath);
  console.log("Projected path count:", projectedPath.length);
  console.log("Canvas size:", MapDimensions);

  const getColorForSpeed = useCallback(
    (speed: number): string => {
      if (!multiColor) return pathColor;
      const normalizedSpeed = Math.max(
        0,
        Math.min(1, (speed - minSpeed) / (maxSpeed - minSpeed))
      );
      if (normalizedSpeed < 0.5) {
        return `rgb(${Math.floor(normalizedSpeed * 2 * 255)}, 255, 0)`;
      }
      return `rgb(255, ${Math.floor((1 - normalizedSpeed) * 2 * 255)}, 0)`;
    },
    [multiColor, pathColor, maxSpeed, minSpeed]
  );

  const drawStoredPaths = useCallback(
    (ctx: CanvasRenderingContext2D, positions: Point[]) => {
      if (positions.length < 2 || !MapDimensions || !realDimensions) return;

      ctx.beginPath();
      ctx.moveTo(
        (positions[0].x * MapDimensions.width) / realDimensions[0],
        MapDimensions.height -
          (positions[0].y * MapDimensions.height) / realDimensions[1]
      );

      for (let i = 1; i < positions.length; i++) {
        const currentPoint = positions[i];
        ctx.lineTo(
          (currentPoint.x * MapDimensions.width) / realDimensions[0],
          MapDimensions.height -
            (currentPoint.y * MapDimensions.height) / realDimensions[1]
        );

        ctx.strokeStyle = getColorForSpeed(currentPoint.speed);
        ctx.lineWidth = pathWidth;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(
          (currentPoint.x * MapDimensions.width) / realDimensions[0],
          MapDimensions.height -
            (currentPoint.y * MapDimensions.height) / realDimensions[1]
        );
      }
    },
    [MapDimensions, realDimensions, getColorForSpeed, pathWidth]
  );

  const drawProjectedPaths = useCallback(
    (ctx: CanvasRenderingContext2D, positions: Point[]) => {
      if (positions.length < 2 || !MapDimensions || !realDimensions) return;

      ctx.beginPath();
      ctx.setLineDash([6, 4]); // dashed style ONCE
      ctx.strokeStyle = "#007BFF"; // vivid violet
      ctx.lineWidth = 3;

      const startX = (positions[0].x * MapDimensions.width) / realDimensions[0];
      const startY =
        MapDimensions.height -
        (positions[0].y * MapDimensions.height) / realDimensions[1];
      ctx.moveTo(startX, startY);

      for (let i = 1; i < positions.length; i++) {
        const x = (positions[i].x * MapDimensions.width) / realDimensions[0];
        const y =
          MapDimensions.height -
          (positions[i].y * MapDimensions.height) / realDimensions[1];
        ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.setLineDash([]); // reset dash
    },
    [MapDimensions, realDimensions]
  );

  const updateCanvasDimensions = useCallback(
    (width: number, height: number) => {
      [drawingCanvasRef, projectedPathRef, highlightCanvasRef].forEach(
        (ref) => {
          if (ref.current) {
            ref.current.width = width;
            ref.current.height = height;
            ref.current.style.width = `${width}px`;
            ref.current.style.height = `${height}px`;
          }
        }
      );
    },
    []
  );

  const handleImageLoad = useCallback(() => {
    if (MapRef.current) {
      const { width, height } = MapRef.current;
      setMapDimensions({ width, height });
      updateCanvasDimensions(width, height);
      setImageLoaded(true);
    }
  }, [updateCanvasDimensions]);

  // Map & canvas rendering
  useLayoutEffect(() => {
    if (!imageLoaded) return; // Don't run until image is loaded

    const updateDimensions = () => {
      if (MapRef.current) {
        const { width, height } = MapRef.current;
        setMapDimensions({ width, height });
        updateCanvasDimensions(width, height);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [imageLoaded, updateCanvasDimensions]);

  useEffect(() => {
    // Wait for everything to be ready
    if (!imageLoaded || !MapDimensions?.width || !MapDimensions?.height) {
      return;
    }

    // Clear all canvases first
    const refs = [drawingCanvasRef, projectedPathRef, highlightCanvasRef];
    refs.forEach((ref) => {
      if (ref.current) {
        const ctx = ref.current.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, ref.current.width, ref.current.height);
        }
      }
    });

    // Draw actual path
    if (actualPath.length > 1) {
      const ctx1 = drawingCanvasRef.current?.getContext("2d");
      if (ctx1) drawStoredPaths(ctx1, actualPath);
    }

    // Draw projected path
    if (projectedPath.length > 1) {
      const ctx2 = projectedPathRef.current?.getContext("2d");
      if (ctx2) drawProjectedPaths(ctx2, projectedPath);
    }

    // Draw highlight (moved here for consistency)
    if (highlightPoint) {
      const ctx3 = highlightCanvasRef.current?.getContext("2d");
      if (ctx3 && highlightCanvasRef.current) {
        const canvasX =
          (highlightPoint.x * MapDimensions.width) / realDimensions[0];
        const canvasY =
          MapDimensions.height -
          (highlightPoint.y * MapDimensions.height) / realDimensions[1];

        ctx3.beginPath();
        ctx3.arc(canvasX, canvasY, 8, 0, Math.PI * 2);
        ctx3.strokeStyle = "#007BFF";
        ctx3.lineWidth = 3;
        ctx3.stroke();
      }
    }
  }, [
    imageLoaded,
    MapDimensions,
    actualPath,
    projectedPath,
    highlightPoint,
    realDimensions,
    drawStoredPaths,
    drawProjectedPaths,
  ]);

  console.log(drawingCanvasRef);

  return (
    <div
      className={`relative bg-white border-2 border-black flex justify-center items-center rounded-xl p-2`}
      style={{
        maxWidth: MapRef.current?.naturalWidth,
        maxHeight: MapRef.current?.naturalHeight,
      }}
    >
      <img
        ref={MapRef}
        src={mapPath}
        className="rounded-xl object-cover"
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
        alt="Map Circuit"
        onLoad={handleImageLoad}
      />

      <canvas
        ref={projectedPathRef}
        className="absolute z-40 rounded-xl pointer-events-none"
      />
      <canvas
        ref={drawingCanvasRef}
        className="absolute z-20 rounded-xl pointer-events-none"
      />
      <canvas
        ref={highlightCanvasRef}
        className="absolute z-30 rounded-xl pointer-events-none"
      />
    </div>
  );
}
