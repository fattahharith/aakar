'use client';

import React, { useEffect, useRef, useState } from 'react';

const SimpleTree: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [growthProgress, setGrowthProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get 2D context');
      }

      // Set canvas dimensions
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Set initial growth progress
      setGrowthProgress(0);
      setIsInitialized(true);

      // Start growth animation
      const startTime = Date.now();
      const growthDuration = 5000; // 5 seconds for full growth

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(1, elapsed / growthDuration);
        setGrowthProgress(newProgress);

        if (newProgress < 1) {
          requestRef.current = requestAnimationFrame(animate);
        }
      };

      requestRef.current = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    } catch (err) {
      console.error('Error initializing SimpleTree:', err);
      setError(err as Error);
    }
  }, [isInitialized]);

  // Draw the tree whenever growth progress changes
  useEffect(() => {
    if (!canvasRef.current || !isInitialized) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set position for tree
      const startX = canvas.width * 0.8;
      const startY = canvas.height;

      // Draw tree trunk
      const trunkHeight = canvas.height * 0.4 * growthProgress;
      const trunkWidth = 20;

      // Create trunk gradient
      const trunkGradient = ctx.createLinearGradient(startX - trunkWidth/2, startY, startX + trunkWidth/2, startY - trunkHeight);
      trunkGradient.addColorStop(0, '#5d4037');
      trunkGradient.addColorStop(0.5, '#8d6e63');
      trunkGradient.addColorStop(1, '#6d4c41');

      ctx.fillStyle = trunkGradient;
      ctx.beginPath();
      ctx.moveTo(startX - trunkWidth/2, startY);
      ctx.lineTo(startX - trunkWidth*0.4, startY - trunkHeight);
      ctx.lineTo(startX + trunkWidth*0.4, startY - trunkHeight);
      ctx.lineTo(startX + trunkWidth/2, startY);
      ctx.closePath();
      ctx.fill();

      // Only draw branches and leaves if we have some growth
      if (growthProgress > 0.2) {
        // Draw branches
        const branchCount = 5;
        const branchProgress = Math.max(0, (growthProgress - 0.2) / 0.8); // Scale to 0-1 after 20% growth

        for (let i = 0; i < branchCount; i++) {
          const branchPosition = 0.3 + (i / branchCount) * 0.7; // Position along trunk (30-100%)
          const branchStartY = startY - trunkHeight * branchPosition;

          // Alternate left and right branches
          const isRightBranch = i % 2 === 0;
          const branchDirection = isRightBranch ? 1 : -1;

          // Calculate branch length based on position and progress
          const maxLength = trunkWidth * 5 * (1 - i / branchCount * 0.3); // Shorter branches near top
          const currentLength = maxLength * branchProgress;

          // Calculate branch angle (more horizontal near bottom, more vertical near top)
          const angleBase = Math.PI / 2; // 90 degrees (pointing up)
          const angleVariation = Math.PI / 4; // 45 degrees
          const branchAngle = angleBase + branchDirection * angleVariation * (1 - i / branchCount);

          // Calculate end coordinates
          const branchEndX = startX + Math.cos(branchAngle) * currentLength;
          const branchEndY = branchStartY - Math.sin(branchAngle) * currentLength;

          // Draw branch
          const branchGradient = ctx.createLinearGradient(startX, branchStartY, branchEndX, branchEndY);
          branchGradient.addColorStop(0, '#6d4c41');
          branchGradient.addColorStop(1, '#8d6e63');

          ctx.strokeStyle = branchGradient;
          ctx.lineWidth = trunkWidth * 0.4 * (1 - i / branchCount * 0.5);
          ctx.beginPath();
          ctx.moveTo(startX, branchStartY);

          // Add a slight curve to branches
          const cpX = startX + (branchEndX - startX) * 0.5 + branchDirection * 15;
          const cpY = branchStartY + (branchEndY - branchStartY) * 0.3 - 10;
          ctx.quadraticCurveTo(cpX, cpY, branchEndX, branchEndY);
          ctx.stroke();

          // Draw leaves if branch is grown enough and we're near the end of growth
          if (branchProgress > 0.5 && i >= 1) {
            const leafCount = 3 + i; // More leaves on higher branches
            const leafProgress = Math.max(0, (branchProgress - 0.5) / 0.5); // Scale to 0-1 after 50% growth

            for (let j = 0; j < leafCount; j++) {
              const leafPosition = 0.3 + (j / leafCount) * 0.7; // Position along branch
              const leafRadius = (8 + i) * leafProgress; // Size based on branch and progress

              // Calculate position
              const leafX = startX + (branchEndX - startX) * leafPosition;
              const leafY = branchStartY + (branchEndY - branchStartY) * leafPosition;

              // Draw leaf
              ctx.beginPath();
              ctx.fillStyle = `rgba(${100 + i * 20}, ${150 + i * 15}, ${80 + i * 10}, ${0.8 * leafProgress})`;
              ctx.ellipse(leafX, leafY, leafRadius, leafRadius * 1.5, 0, 0, Math.PI * 2);
              ctx.fill();

              // Add simple leaf vein
              ctx.strokeStyle = `rgba(${70 + i * 10}, ${120 + i * 10}, ${60 + i * 10}, ${0.5 * leafProgress})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(leafX, leafY - leafRadius);
              ctx.lineTo(leafX, leafY + leafRadius);
              ctx.stroke();
            }
          }
        }
      }
    } catch (err) {
      console.error('Error drawing SimpleTree:', err);
    }
  }, [isInitialized, growthProgress]);

  if (error) {
    return (
      <div className="fixed top-0 right-0 h-full w-64 flex items-center justify-center text-gray-500 pointer-events-none">
        Failed to render tree
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ display: 'block' }}
    />
  );
};

export default SimpleTree;