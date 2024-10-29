import React, { useState, useEffect, useMemo } from "react";

export const useMouseOverZoom = (
  sourceRef,
  targetRef,
  cursorRef,
  radius = 25
) => {
  const [state, setState] = useState({ x: 0, y: 0, isActive: false });

  useEffect(() => {
    const el = sourceRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      console.log("Mouse over");
      const rect = el.getBoundingClientRect();
      setState({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true,
      });
    };

    const handleMouseLeave = () => {
      setState((prev) => ({ ...prev, isActive: false }));
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [sourceRef]);

  const { x, y, isActive } = state;

  const zoomBounds = useMemo(() => {
    return {
      left: x - radius,
      top: y - radius,
      width: radius * 3,
      height: radius * 3,
    };
  }, [x, y, radius]);

  useEffect(() => {
    if (cursorRef.current) {
      const { left, top, width, height } = zoomBounds;
      cursorRef.current.style.left = `${left}px`;
      cursorRef.current.style.top = `${top}px`;
      cursorRef.current.style.width = `${width}px`;
      cursorRef.current.style.height = `${height}px`;
      cursorRef.current.style.display = isActive ? "block" : "none";
    }
  }, [zoomBounds, isActive]);

  useEffect(() => {
    if (sourceRef.current && targetRef.current) {
      const ctx = targetRef.current.getContext("2d");
      if (ctx) {
        if (isActive) {
          const { left, top, width, height } = zoomBounds;
          const imageRatio =
            sourceRef.current.naturalWidth / sourceRef.current.width;
          ctx.drawImage(
            sourceRef.current,
            left * imageRatio,
            top * imageRatio,
            width * imageRatio,
            height * imageRatio,
            0,
            0,
            targetRef.current.width,
            targetRef.current.height
          );
        } else {
          ctx.clearRect(
            0,
            0,
            targetRef.current.width,
            targetRef.current.height
          );
        }
      }
    }
  }, [zoomBounds, isActive, sourceRef, targetRef]);

  return { ...state, zoomBounds };
};
