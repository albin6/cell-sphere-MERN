import React, { useState, useEffect, useCallback } from "react";

export const useMouseOverZoom = (
  sourceRef,
  targetRef,
  cursorRef,
  zoomLevel = 2
) => {
  const [isActive, setIsActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);

  const handleMouseMove = useCallback(
    (e) => {
      const source = sourceRef.current;
      if (!source) return;

      const rect = source.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [sourceRef]
  );

  const updateZoom = useCallback(() => {
    const source = sourceRef.current;
    const target = targetRef.current;
    const cursor = cursorRef.current;
    if (!source || !target || !cursor || !imageLoaded) return;

    const ctx = target.getContext("2d");
    if (!ctx) return;

    const { x, y } = mousePosition;
    const scaleX = source.naturalWidth / source.width;
    const scaleY = source.naturalHeight / source.height;

    const zoomWidth = target.width / zoomLevel;
    const zoomHeight = target.height / zoomLevel;

    const sourceX = Math.max(
      0,
      Math.min(x * scaleX - zoomWidth / 2, source.naturalWidth - zoomWidth)
    );
    const sourceY = Math.max(
      0,
      Math.min(y * scaleY - zoomHeight / 2, source.naturalHeight - zoomHeight)
    );

    ctx.drawImage(
      source,
      sourceX,
      sourceY,
      zoomWidth,
      zoomHeight,
      0,
      0,
      target.width,
      target.height
    );

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
    cursor.style.width = `${zoomWidth / scaleX}px`;
    cursor.style.height = `${zoomHeight / scaleY}px`;
    cursor.style.display = isActive ? "block" : "none";
  }, [
    sourceRef,
    targetRef,
    cursorRef,
    mousePosition,
    isActive,
    imageLoaded,
    zoomLevel,
  ]);

  useEffect(() => {
    const source = sourceRef.current;
    if (!source) return;

    const handleLoad = () => {
      setImageLoaded(true);
    };

    if (source.complete) {
      setImageLoaded(true);
    } else {
      source.addEventListener("load", handleLoad);
    }

    source.addEventListener("mouseenter", handleMouseEnter);
    source.addEventListener("mouseleave", handleMouseLeave);
    source.addEventListener("mousemove", handleMouseMove);

    return () => {
      source.removeEventListener("load", handleLoad);
      source.removeEventListener("mouseenter", handleMouseEnter);
      source.removeEventListener("mouseleave", handleMouseLeave);
      source.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sourceRef, handleMouseEnter, handleMouseLeave, handleMouseMove]);

  useEffect(() => {
    if (isActive && imageLoaded) {
      updateZoom();
    }
  }, [isActive, imageLoaded, mousePosition, updateZoom]);

  return { isActive };
};
