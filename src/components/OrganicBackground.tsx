'use client';

import React, { useRef, useEffect, useState } from 'react';

type Point = {
  x: number;
  y: number;
};

type Branch = {
  start: Point;
  end: Point;
  length: number;
  angle: number;
  thickness: number;
  color: string;
  generation: number;
  isTip: boolean;
  hasLeaf?: boolean;
  controlPoint1?: Point;
  controlPoint2?: Point;
  leafParams?: {
    orientation: number;
    size: number;
    color: string;
    veinColor: string;
    angle: number;
  };
};

type Root = {
  branches: Branch[];
  growthRate: number;
  maxLength: number;
  initialThickness: number;
  growActive: boolean;
  color: string;
  isRightSide: boolean;
};

const OrganicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const [roots, setRoots] = useState<Root[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [hoveredPosition, setHoveredPosition] = useState<Point | null>(null);
  const animationTimeRef = useRef<number>(0);

  // Enhanced organic color palette for roots
  const colorPalette = [
    'rgba(20, 90, 60, 0.75)',   // Rich forest green
    'rgba(35, 110, 45, 0.75)',   // Moss green
    'rgba(70, 100, 25, 0.75)',   // Olive green
    'rgba(105, 85, 35, 0.75)',   // Earthy brown
    'rgba(150, 120, 65, 0.75)'  // Sandy brown
  ];

  // Leaf color variations
  const leafColors = [
    'rgba(60, 145, 60, 0.85)',  // Bright green
    'rgba(85, 160, 45, 0.85)',  // Fresh leaf green
    'rgba(120, 180, 70, 0.85)', // Yellow-green
    'rgba(95, 165, 55, 0.85)',  // Medium green
    'rgba(40, 130, 40, 0.85)',  // Deep green
  ];

  // Initialize the canvas and start the animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setCanvasSize({ width: canvas.width, height: canvas.height });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Create initial roots
    initializeRoots();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Start animation when roots are ready
  useEffect(() => {
    if (roots.length > 0 && canvasSize.width > 0) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [roots, canvasSize]);

  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setHoveredPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize the root structures
  const initializeRoots = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newRoots: Root[] = [];
    // Adjust the number of roots based on screen width for better visual balance
    const numRoots = Math.min(8, Math.max(5, Math.floor(canvas.width / 300)));

    // Create initial roots spread across bottom of screen with better spacing
    for (let i = 0; i < numRoots; i++) {
      const startX = (canvas.width / (numRoots + 1)) * (i + 1) + (Math.random() * 80 - 40);
      const startY = canvas.height - (Math.random() * 30);

      // Make roots more vertical overall (70-115 degrees)
      const angle = (Math.random() * 45 + 70) * (Math.PI / 180);

      // Thicker roots at the base
      const thickness = Math.random() * 5 + 8; // 8-13px thickness for better visibility
      const growthRate = Math.random() * 0.2 + 0.15; // 0.15-0.35 growth rate
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      // Determine if this root is on the right side of the screen
      const isRightSide = startX > canvas.width / 2;

      // Slightly more vertical angle for right-side roots to create natural asymmetry
      const adjustedAngle = isRightSide
        ? angle - (Math.random() * 0.1) // More vertical
        : angle;

      const initialBranch: Branch = {
        start: { x: startX, y: startY },
        end: { x: startX, y: startY }, // Will be updated during growth
        length: 0,
        angle: adjustedAngle,
        thickness,
        color,
        generation: 0,
        isTip: true,
        // Add bezier control points for curvature
        controlPoint1: {
          x: startX + Math.random() * 40 - 20,
          y: startY - (Math.random() * 50 + 20)
        },
        controlPoint2: {
          x: startX + Math.random() * 40 - 20,
          y: startY - (Math.random() * 80 + 40)
        }
      };

      // Set longer maxLength for roots on the right side
      const baseMaxLength = canvas.height * 0.5; // At least half the canvas height
      const maxLength = isRightSide
        ? baseMaxLength + Math.random() * 150 // Right side: 50% of height + up to 150px more
        : baseMaxLength + Math.random() * 50;  // Left side: 50% of height + up to 50px more

      newRoots.push({
        branches: [initialBranch],
        growthRate,
        maxLength,
        initialThickness: thickness,
        growActive: true,
        color,
        isRightSide
      });
    }

    setRoots(newRoots);
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update animation time (increment slowly for gentle movement)
    animationTimeRef.current += 0.01;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw roots
    const updatedRoots = growRoots();
    drawRoots(ctx, updatedRoots);

    // Continue animation
    requestRef.current = requestAnimationFrame(animate);
  };

  // Draw a leaf at the end of a branch
  const drawLeaf = (ctx: CanvasRenderingContext2D, branch: Branch, isHighlighted: boolean) => {
    // Initialize leaf parameters if they don't exist yet
    if (!branch.leafParams) {
      const orientation = Math.random() > 0.5 ? 1 : -1;
      branch.leafParams = {
        orientation,
        size: branch.thickness * (2.5 + Math.random()),
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
        veinColor: 'rgba(40, 100, 40, 0.6)',
        angle: (Math.random() * 0.3) - 0.15, // Small random angle variation
      };
    }

    const leafSize = branch.leafParams.size;
    const orientation = branch.leafParams.orientation;

    // Get leaf color - use highlighted color or stored leaf color
    const leafColor = isHighlighted
      ? 'rgba(180, 250, 180, 0.85)'
      : branch.leafParams.color;

    // Save context state
    ctx.save();

    // Translate to branch tip
    ctx.translate(branch.end.x, branch.end.y);

    // Rotate according to branch angle + stored leaf angle + subtle animation
    // Use sin for gentle swaying motion based on animationTime and a unique value from leaf size
    const gentleSway = Math.sin(animationTimeRef.current + leafSize * 0.3) * 0.05;
    ctx.rotate(branch.angle + (orientation * Math.PI / 6) + branch.leafParams.angle + gentleSway);

    // Adjust leaf size with very subtle breathing effect
    const breatheFactor = 1 + Math.sin(animationTimeRef.current * 0.7) * 0.02;
    const animatedLeafSize = leafSize * breatheFactor;

    // Draw leaf shape (oval with pointed tip) with subtle size variation
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      animatedLeafSize * 0.5, -animatedLeafSize * 0.3,
      animatedLeafSize * 1.5, -animatedLeafSize * 0.2,
      animatedLeafSize * 2, -animatedLeafSize * 0.1
    );
    ctx.bezierCurveTo(
      animatedLeafSize * 1.5, animatedLeafSize * 0.5,
      animatedLeafSize * 0.5, animatedLeafSize * 0.5,
      0, 0
    );

    // Fill leaf
    ctx.fillStyle = leafColor;
    ctx.fill();

    // Add vein on leaf
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      animatedLeafSize * 0.6, 0,
      animatedLeafSize * 1.2, -animatedLeafSize * 0.1,
      animatedLeafSize * 1.8, -animatedLeafSize * 0.05
    );
    ctx.strokeStyle = isHighlighted
      ? 'rgba(230, 255, 230, 0.8)'
      : branch.leafParams.veinColor;
    ctx.lineWidth = branch.thickness * 0.2;
    ctx.stroke();

    // Restore context
    ctx.restore();
  };

  // Grow the roots
  const growRoots = () => {
    if (roots.length === 0) return roots;

    return roots.map(root => {
      if (!root.growActive) return root; // Skip inactive roots

      const newBranches = [...root.branches];
      let stillGrowing = false;

      // Process each branch
      for (let i = 0; i < newBranches.length; i++) {
        const branch = newBranches[i];

        if (branch.isTip && branch.length < root.maxLength) {
          // Grow the branch
          const growAmount = root.growthRate;
          branch.length += growAmount;
          stillGrowing = true;

          // Update end position based on angle and length
          const dx = Math.cos(branch.angle) * branch.length;
          const dy = Math.sin(branch.angle) * branch.length;
          branch.end = {
            x: branch.start.x + dx,
            y: branch.start.y - dy
          };

          // Calculate thickness based on distance from root start (thinner as it goes up)
          const thicknessFactor = 1 - (branch.length / root.maxLength) * 0.7; // Reduce to 30% of original at full length
          branch.thickness = root.initialThickness * Math.max(0.3, thicknessFactor);

          // Randomize control points as the branch grows for organic movement
          if (branch.controlPoint1 && branch.controlPoint2) {
            // Only wiggle the branches when they're still growing significantly
            if (branch.length < root.maxLength * 0.9) {
              // Use sine wave motion for more organic movement
              const wiggle = Math.sin(branch.length * 0.05) * 12;
              branch.controlPoint1.x += Math.random() * wiggle * 0.02;
              branch.controlPoint2.x += Math.random() * wiggle * 0.02;
            }
          }

          // Randomly create branches (with decreasing probability based on generation)
          // Lower probability for a more elegant look with fewer branches
          const branchProbability = 0.009 / (branch.generation + 1);

          // Limit branches based on generation to prevent overcrowding
          const maxGeneration = 5;

          if (branch.length > 60 && Math.random() < branchProbability && branch.generation < maxGeneration) {
            // Fork into two branches
            branch.isTip = false; // Current branch is no longer a tip

            // Determine if we should add a leaf to this former tip
            const leafProbability = root.isRightSide ? 0.7 : 0.5; // More leaves on right side
            branch.hasLeaf = Math.random() < leafProbability;

            // If adding a leaf, initialize its parameters
            if (branch.hasLeaf) {
              branch.leafParams = {
                orientation: Math.random() > 0.5 ? 1 : -1,
                size: branch.thickness * (2.5 + Math.random()),
                color: leafColors[Math.floor(Math.random() * leafColors.length)],
                veinColor: 'rgba(40, 100, 40, 0.6)',
                angle: (Math.random() * 0.3) - 0.15,
              };
            }

            // Calculate new branch positions
            const angleVariation = Math.random() * 0.4 + 0.2; // 0.2-0.6 radians
            const newLength = branch.length * 0.45; // Start at 45% of parent length
            const newThickness = branch.thickness * 0.75; // 75% of parent thickness

            // Create first new branch (slightly left)
            const newAngle1 = branch.angle - angleVariation;
            const controlOffset1 = 35 + Math.random() * 20;

            newBranches.push({
              start: {...branch.end},
              end: {...branch.end},
              length: newLength,
              angle: newAngle1,
              thickness: newThickness,
              color: branch.color,
              generation: branch.generation + 1,
              isTip: true,
              controlPoint1: {
                x: branch.end.x + Math.cos(newAngle1) * controlOffset1,
                y: branch.end.y - Math.sin(newAngle1) * controlOffset1
              },
              controlPoint2: {
                x: branch.end.x + Math.cos(newAngle1) * controlOffset1 * 2,
                y: branch.end.y - Math.sin(newAngle1) * controlOffset1 * 2
              }
            });

            // Create second new branch (slightly right)
            const newAngle2 = branch.angle + angleVariation;
            const controlOffset2 = 35 + Math.random() * 20;

            newBranches.push({
              start: {...branch.end},
              end: {...branch.end},
              length: newLength,
              angle: newAngle2,
              thickness: newThickness,
              color: branch.color,
              generation: branch.generation + 1,
              isTip: true,
              controlPoint1: {
                x: branch.end.x + Math.cos(newAngle2) * controlOffset2,
                y: branch.end.y - Math.sin(newAngle2) * controlOffset2
              },
              controlPoint2: {
                x: branch.end.x + Math.cos(newAngle2) * controlOffset2 * 2,
                y: branch.end.y - Math.sin(newAngle2) * controlOffset2 * 2
              }
            });
          }

          // Add leaves to branch tips that are far enough along
          if (branch.isTip && branch.length > root.maxLength * 0.6) {
            // Higher chance of leaves on right side and on higher branches
            const leafThreshold = root.isRightSide ? 0.3 : 0.5;
            branch.hasLeaf = Math.random() > leafThreshold;

            // If adding a leaf, initialize its parameters
            if (branch.hasLeaf) {
              branch.leafParams = {
                orientation: Math.random() > 0.5 ? 1 : -1,
                size: branch.thickness * (2.5 + Math.random()),
                color: leafColors[Math.floor(Math.random() * leafColors.length)],
                veinColor: 'rgba(40, 100, 40, 0.6)',
                angle: (Math.random() * 0.3) - 0.15,
              };
            }
          }
        }
      }

      // Check if the root has reached maximum height and add leaves to the tips
      if (!stillGrowing) {
        newBranches.forEach(branch => {
          if (branch.isTip && !branch.hasLeaf) {
            // High chance to add leaves to final tips
            branch.hasLeaf = Math.random() > 0.2;

            // If adding a leaf, initialize its parameters
            if (branch.hasLeaf) {
              branch.leafParams = {
                orientation: Math.random() > 0.5 ? 1 : -1,
                size: branch.thickness * (2.5 + Math.random()),
                color: leafColors[Math.floor(Math.random() * leafColors.length)],
                veinColor: 'rgba(40, 100, 40, 0.6)',
                angle: (Math.random() * 0.3) - 0.15,
              };
            }
          }
        });
      }

      return {
        ...root,
        branches: newBranches,
        growActive: stillGrowing
      };
    });
  };

  // Draw the roots on the canvas
  const drawRoots = (ctx: CanvasRenderingContext2D, rootsToDraw: Root[]) => {
    // First pass: Draw all main branches
    rootsToDraw.forEach(root => {
      root.branches.forEach(branch => {
        // Calculate if branch is near mouse for highlighting
        let isHighlighted = false;
        if (hoveredPosition) {
          const centerX = (branch.start.x + branch.end.x) / 2;
          const centerY = (branch.start.y + branch.end.y) / 2;
          const distance = Math.sqrt(
            Math.pow(centerX - hoveredPosition.x, 2) +
            Math.pow(centerY - hoveredPosition.y, 2)
          );
          isHighlighted = distance < 120; // Slightly larger highlight radius (120px)
        }

        // Draw the branch with Bezier curve for organic look
        ctx.beginPath();
        ctx.moveTo(branch.start.x, branch.start.y);

        if (branch.controlPoint1 && branch.controlPoint2) {
          // Use bezier curve for organic look
          ctx.bezierCurveTo(
            branch.controlPoint1.x, branch.controlPoint1.y,
            branch.controlPoint2.x, branch.controlPoint2.y,
            branch.end.x, branch.end.y
          );
        } else {
          // Fallback to line if no control points
          ctx.lineTo(branch.end.x, branch.end.y);
        }

        // Set line style based on highlight state
        ctx.strokeStyle = isHighlighted
          ? 'rgba(160, 240, 160, 0.85)' // Brighter green when highlighted
          : branch.color;
        ctx.lineWidth = isHighlighted
          ? branch.thickness * 1.6  // Slightly thicker highlight
          : branch.thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw leaf if this branch has one
        if (branch.hasLeaf) {
          drawLeaf(ctx, branch, isHighlighted);
        }

        // Draw root tips (small circles)
        if (branch.isTip && !branch.hasLeaf) {
          ctx.beginPath();
          ctx.arc(branch.end.x, branch.end.y, branch.thickness / 1.8, 0, Math.PI * 2);
          ctx.fillStyle = isHighlighted
            ? 'rgba(160, 240, 160, 0.85)'
            : branch.color;
          ctx.fill();
        }
      });
    });

    // Second pass: Add subtle glow to highlighted branches
    if (hoveredPosition) {
      ctx.save();
      ctx.filter = 'blur(8px)';
      ctx.globalCompositeOperation = 'lighter';

      rootsToDraw.forEach(root => {
        root.branches.forEach(branch => {
          const centerX = (branch.start.x + branch.end.x) / 2;
          const centerY = (branch.start.y + branch.end.y) / 2;
          const distance = Math.sqrt(
            Math.pow(centerX - hoveredPosition.x, 2) +
            Math.pow(centerY - hoveredPosition.y, 2)
          );

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(branch.start.x, branch.start.y);

            if (branch.controlPoint1 && branch.controlPoint2) {
              ctx.bezierCurveTo(
                branch.controlPoint1.x, branch.controlPoint1.y,
                branch.controlPoint2.x, branch.controlPoint2.y,
                branch.end.x, branch.end.y
              );
            } else {
              ctx.lineTo(branch.end.x, branch.end.y);
            }

            ctx.strokeStyle = 'rgba(160, 240, 160, 0.35)';
            ctx.lineWidth = branch.thickness * 2.2;
            ctx.stroke();
          }
        });
      });

      ctx.restore();
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{
        display: 'block',
      }}
    />
  );
};

export default OrganicBackground;