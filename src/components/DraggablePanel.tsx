 import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface DraggablePanelProps {
  children: React.ReactNode;
  initialHeight?: number;
  maxHeight?: number;
  minHeight?: number;
  snapPoints?: number[];
  className?: string;
  onHeightChange?: (height: number) => void;
  onSnapPointChange?: (snapIndex: number) => void;
}

export const DraggablePanel: React.FC<DraggablePanelProps> = ({
  children,
  initialHeight = 400,
  maxHeight = 600,
  minHeight = 120,
  snapPoints = [],
  className = '',
  onHeightChange,
  onSnapPointChange
}) => {
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const defaultSnapPoints = snapPoints.length > 0 ? snapPoints : [
    Math.round(screenHeight * 0.25),
    Math.round(screenHeight * 0.6),
    screenHeight - 80
  ];

  const [height, setHeight] = useState(initialHeight);
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);
  const panelRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);

  const backgroundOpacity = useTransform(y, [-200, 0], [0.3, 0.1]);

  const findClosestSnapPoint = useCallback((currentHeight: number) => {
    let closest = 0;
    let minDistance = Math.abs(defaultSnapPoints[0] - currentHeight);

    defaultSnapPoints.forEach((point, index) => {
      const distance = Math.abs(point - currentHeight);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    return closest;
  }, [defaultSnapPoints]);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const newHeight = height - info.delta.y;
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    setHeight(clampedHeight);
    onHeightChange?.(clampedHeight);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const velocity = info.velocity.y;
    let targetHeight = height;

    if (Math.abs(velocity) > 300) {
      if (velocity > 0) {
        const currentIndex = findClosestSnapPoint(height);
        targetHeight = currentIndex > 0 ? defaultSnapPoints[currentIndex - 1] : defaultSnapPoints[0];
      } else {
        const currentIndex = findClosestSnapPoint(height);
        targetHeight = currentIndex < defaultSnapPoints.length - 1
          ? defaultSnapPoints[currentIndex + 1]
          : defaultSnapPoints[defaultSnapPoints.length - 1];
      }
    } else {
      const closestIndex = findClosestSnapPoint(height);
      targetHeight = defaultSnapPoints[closestIndex];
    }

    targetHeight = Math.max(minHeight, Math.min(maxHeight, targetHeight));
    setHeight(targetHeight);
    const snapIndex = findClosestSnapPoint(targetHeight);
    setCurrentSnapIndex(snapIndex);
    onHeightChange?.(targetHeight);
    onSnapPointChange?.(snapIndex);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black pointer-events-none z-10"
        style={{ opacity: backgroundOpacity }}
      />
      <motion.div
        ref={panelRef}
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-20 ${className}`}
        style={{ height }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 35, stiffness: 300, mass: 0.5 }}
      >
        <motion.div
          className="w-full h-6 flex justify-center items-center cursor-grab active:cursor-grabbing"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 40 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          whileTap={{ scale: 1.05 }}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </motion.div>
        <div className="px-4 pb-4 overflow-hidden" style={{ height: height - 24 }}>
          {children}
        </div>
      </motion.div>
    </>
  );
};