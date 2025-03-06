'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import EnhancedTree with no SSR
const EnhancedTree = dynamic(() => import('../components/EnhancedTree'), {
  ssr: false,
});

// Fallback component in case tree fails to load
const FallbackTree = () => (
  <div className="fixed top-0 right-0 h-full w-64 pointer-events-none" style={{ opacity: 0.4 }}>
    <svg viewBox="0 0 100 400" preserveAspectRatio="none" className="h-full w-full">
      <path
        d="M50,400 L50,150 M30,200 L70,200 M20,250 L80,250 M40,180 L60,180 M35,220 L65,220"
        stroke="#5d4037"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </div>
);

export default function Home() {
  // State to track if animations should start
  const [isLoaded, setIsLoaded] = useState(false);
  const [canvasSupported, setCanvasSupported] = useState(true);
  const [treeError, setTreeError] = useState(false);

  // Set loaded state after component mounts
  useEffect(() => {
    setIsLoaded(true);

    // Check if canvas is supported
    const testCanvas = document.createElement('canvas');
    const isCanvasSupported = !!(testCanvas.getContext && testCanvas.getContext('2d'));
    setCanvasSupported(isCanvasSupported);

    // Add a failsafe in case the canvas is supported but doesn't render
    const canvasCheckTimer = setTimeout(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        try {
          const ctx = canvas.getContext('2d');
          ctx?.getImageData(0, 0, 1, 1);
        } catch {
          setCanvasSupported(false);
        }
      }
    }, 5000);

    return () => clearTimeout(canvasCheckTimer);
  }, []);

  // Error boundary for the tree component
  const handleTreeError = () => {
    console.error("Tree component failed to render");
    setTreeError(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Enhanced Tree Animation with error handling */}
      {canvasSupported && !treeError ? (
        <div onError={handleTreeError}>
          <EnhancedTree />
        </div>
      ) : (
        <FallbackTree />
      )}

      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-20 sm:pt-28 lg:pt-40 relative z-20">
        <div className={`max-w-4xl transition-all duration-1000 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="project-title">The Aakar Project</div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Sustainable Future <br className="hidden sm:block" />
            <span className="metallic-text">Through Technology</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-10 text-foreground/90 max-w-2xl leading-relaxed">
            Building software, data, and AI solutions that directly contribute to sustainability projects in Malaysia.
          </p>

          {/* CTA Button */}
          <div className={`transition-all duration-1000 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button className="glossy-button text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 mr-4">
              Get Started
            </button>
            <button
              className="bg-transparent border-2 border-metal-highlight hover:bg-accent/10 text-foreground py-4 px-8 rounded-full text-lg transition-all duration-300 accent-text"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Add subtle blur gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>

      <div className={`absolute -bottom-10 right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-60' : 'opacity-0'} z-10`}></div>
    </div>
  );
}