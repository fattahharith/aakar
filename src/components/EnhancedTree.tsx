'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

interface ModernBackgroundProps {
  onError?: (error: Error) => void;
}

const ModernBackground: React.FC<ModernBackgroundProps> = ({ onError = () => {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const connectionLinesRef = useRef<Connection[]>([]);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Configuration
  const config = {
    particleCount: 80,
    particleColor: 'rgba(74, 140, 106, 0.4)',
    particleColorAlt: 'rgba(106, 176, 76, 0.4)',
    lineColor: 'rgba(74, 140, 106, 0.15)',
    lineColorHighlight: 'rgba(123, 174, 62, 0.25)',
    particleSize: 2.5,
    particleSizeRange: 2,
    speed: 0.25,
    connectionDistance: 180,
    mouseInfluenceRadius: 180,
    mouseForce: 0.15,
    // Enhanced persistence settings for better transition
    persistenceTime: 4.5, // increased from 3 to 4.5 seconds for longer visual interest
    baseMovementAmplitude: 0.3, // increased from 0.2 to 0.3 for more noticeable natural movement
    baseMovementFrequency: 0.015, // slightly increased frequency of movement
    decayEasing: 'power3.out', // smoother decay curve
  };

  type Particle = {
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    highlightProgress: number;
    lastInteraction: number; // timestamp of last interaction
    uniqueOffset: number; // unique offset for each particle for varied animation
  };

  type Connection = {
    from: Particle;
    to: Particle;
    opacity: number;
  };

  const initializeParticles = useCallback(() => {
    if (!containerRef.current) return [];

    const { width, height } = dimensions;
    const particles: Particle[] = [];

    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: config.particleSize + Math.random() * config.particleSizeRange,
        color: Math.random() > 0.5 ? config.particleColor : config.particleColorAlt,
        speedX: (Math.random() - 0.5) * config.speed,
        speedY: (Math.random() - 0.5) * config.speed,
        highlightProgress: 0,
        lastInteraction: 0,
        uniqueOffset: Math.random() * 1000, // Random offset for varied animation
      });
    }

    return particles;
  }, [dimensions, config.particleCount, config.particleSize, config.particleSizeRange, config.particleColor, config.particleColorAlt, config.speed]);

  const findConnections = useCallback((particles: Particle[]): Connection[] => {
    const connections: Connection[] = [];

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          connections.push({
            from: particles[i],
            to: particles[j],
            opacity: 1 - (distance / config.connectionDistance),
          });
        }
      }
    }

    return connections;
  }, [config.connectionDistance]);

  const animate = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Current timestamp for time-based animations
    const now = performance.now();

    // Update particle positions
    particlesRef.current.forEach(particle => {
      // Apply mouse influence
      const dx = mousePositionRef.current.x - particle.x;
      const dy = mousePositionRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < config.mouseInfluenceRadius) {
        const force = (config.mouseInfluenceRadius - distance) / config.mouseInfluenceRadius;
        particle.speedX += dx * force * config.mouseForce * 0.01;
        particle.speedY += dy * force * config.mouseForce * 0.01;

        // Record the interaction time
        particle.lastInteraction = now;

        // Highlight particles near mouse with smoother animation
        gsap.to(particle, {
          highlightProgress: 1,
          duration: 0.4, // slightly longer for smoother transition
          ease: "power2.out" // changed from power1 to power2 for smoother effect
        });
      } else {
        // Calculate time since last interaction
        const timeSinceInteraction = (now - particle.lastInteraction) / 1000; // in seconds

        // If still within persistence time, maintain visual interest with improved transitions
        if (timeSinceInteraction < config.persistenceTime) {
          // Improved gradual reduction formula with smoother curve
          const highlightFactor = Math.pow(1 - (timeSinceInteraction / config.persistenceTime), 1.5);

          gsap.to(particle, {
            highlightProgress: 0.4 * highlightFactor, // increased from 0.3 to 0.4 for more noticeable effect
            duration: 1.2, // longer duration for smoother transition
            ease: config.decayEasing
          });

          // Enhanced natural movement based on unique offset and time
          const naturalMovementFactor =
            Math.sin((now * config.baseMovementFrequency) + particle.uniqueOffset) *
            config.baseMovementAmplitude *
            (1 - timeSinceInteraction / config.persistenceTime * 0.5); // gradually reduce influence

          particle.speedX += naturalMovementFactor * 0.012; // slightly increased influence
          particle.speedY += naturalMovementFactor * 0.012;
        } else {
          // After persistence time, maintain subtle ambient motion
          gsap.to(particle, {
            highlightProgress: 0,
            duration: 1.5, // longer for smoother fade out
            ease: "power3.out"
          });

          // More complex natural movement pattern after interaction ends
          const angle = (now * 0.0005) + particle.uniqueOffset;
          const naturalMovementX = Math.sin(angle) * config.baseMovementAmplitude * 0.5;
          const naturalMovementY = Math.cos(angle * 0.7) * config.baseMovementAmplitude * 0.5;

          particle.speedX += naturalMovementX * 0.007;
          particle.speedY += naturalMovementY * 0.007;
        }
      }

      // Apply speed damping
      particle.speedX *= 0.98;
      particle.speedY *= 0.98;

      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
        particle.x = Math.max(0, Math.min(particle.x, canvas.width));
      }

      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
        particle.y = Math.max(0, Math.min(particle.y, canvas.height));
      }
    });

    // Find and draw connections
    connectionLinesRef.current = findConnections(particlesRef.current);

    connectionLinesRef.current.forEach(connection => {
      const highlightFactor = connection.from.highlightProgress + connection.to.highlightProgress;
      const lineColor = highlightFactor > 0
        ? gsap.utils.interpolate(config.lineColor, config.lineColorHighlight, Math.min(1, highlightFactor / 2))
        : config.lineColor;

      ctx.beginPath();
      ctx.moveTo(connection.from.x, connection.from.y);
      ctx.lineTo(connection.to.x, connection.to.y);
      ctx.strokeStyle = lineColor;
      ctx.globalAlpha = connection.opacity * (1 + Math.min(0.5, highlightFactor / 2));
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Draw particles
    particlesRef.current.forEach(particle => {
      const color = particle.highlightProgress > 0
        ? gsap.utils.interpolate(particle.color, config.lineColorHighlight, particle.highlightProgress)
        : particle.color;

      const size = particle.size + (particle.highlightProgress * 2);

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    // Schedule next frame
    animationRef.current = requestAnimationFrame(animate);
  }, [config.mouseInfluenceRadius, config.mouseForce, config.lineColor, config.lineColorHighlight, findConnections,
      config.persistenceTime, config.baseMovementAmplitude, config.baseMovementFrequency, config.decayEasing]);

  // Handle window resize
  const handleResize = () => {
    if (!containerRef.current || !canvasRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ width, height });

    canvasRef.current.width = width;
    canvasRef.current.height = height;
  };

  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mousePositionRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Mouse leave handler with improved behavior
  const handleMouseLeave = useCallback(() => {
    // Instead of instantly moving mouse to center, create a smooth transition
    // by gradually moving it there, creating a more natural flow of particles
    const targetX = dimensions.width / 2;
    const targetY = dimensions.height / 2;

    // Use GSAP to animate the mouse position reference smoothly
    gsap.to(mousePositionRef.current, {
      x: targetX,
      y: targetY,
      duration: 2.5,
      ease: "power2.inOut"
    });
  }, [dimensions.width, dimensions.height]);

  // Initialize animation
  useEffect(() => {
    try {
      if (dimensions.width === 0 || dimensions.height === 0) {
        // Initial resize to get dimensions
        handleResize();
        return;
      }

      // Initialize particles
      particlesRef.current = initializeParticles();

      // Start animation
      animate();

      // Add event listeners
      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  }, [dimensions, animate, handleMouseLeave, initializeParticles, onError]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        style={{ opacity: 0.8 }}
      />

      {/* Gradient blobs in the background */}
      <div className="absolute -bottom-[100px] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-[20%] left-[5%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl animate-pulse-slow"
        style={{ animationDelay: '-2s' }}></div>
      <div className="absolute top-[10%] right-[15%] w-[200px] h-[200px] rounded-full bg-secondary/5 blur-3xl animate-pulse-slow"
        style={{ animationDelay: '-4s' }}></div>
    </div>
  );
};

// Export with the same name as the original component for compatibility
const EnhancedTree: React.FC<ModernBackgroundProps> = ({ onError }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error) => {
    setHasError(true);
    if (onError) onError(error);
  };

  if (hasError) {
    // Fallback in case of error
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-background to-light-accent opacity-50 z-0" />
    );
  }

  return <ModernBackground onError={handleError} />;
};

export default EnhancedTree;