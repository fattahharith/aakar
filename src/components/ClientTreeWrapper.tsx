'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Dynamically import components with no SSR
const EnhancedTree = dynamic(() => import('./EnhancedTree'), { ssr: false });
const SimpleTree = dynamic(() => import('./SimpleTree'), { ssr: false });

type RenderMode = 'enhanced' | 'simple' | 'none';

const ClientTreeWrapper: React.FC = () => {
  // Default to enhanced tree for better visuals
  const [renderMode, setRenderMode] = useState<RenderMode>('enhanced');
  const [error, setError] = useState<Error | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const pathname = usePathname();

  // Don't render the tree on specific pages (like admin pages)
  const shouldRenderTree = !pathname || !pathname.startsWith('/admin');

  // Handle errors in the enhanced tree
  const handleTreeError = (err: Error) => {
    console.error('Error in EnhancedTree, falling back to SimpleTree:', err);
    setError(err);
    setRenderMode('simple');
  };

  // Show controls with Ctrl+Shift+T
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setShowControls(prev => !prev);
      }
      // Debug mode with Ctrl+Shift+D
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDebugMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debugMode]);

  // Toggle controls
  const toggleControls = () => {
    setShowControls(prev => !prev);
  };

  // Toggle debug mode
  const toggleDebugMode = () => {
    setDebugMode(prev => !prev);
  };

  if (!shouldRenderTree) {
    return null;
  }

  return (
    <>
      {/* Render tree based on selected mode */}
      {renderMode === 'enhanced' && <EnhancedTree onError={handleTreeError} />}
      {renderMode === 'simple' && <SimpleTree />}

      {/* Debug info overlay when debug mode is enabled */}
      {debugMode && (
        <div className="fixed top-4 left-4 p-3 bg-white/90 border border-gray-300 rounded-lg shadow-lg z-50 text-xs max-w-sm">
          <div className="font-semibold mb-1">Debug Mode</div>
          <div>Current renderer: {renderMode}</div>
          {error && <div className="text-red-500 mt-1">Error: {error.message}</div>}
          <div className="mt-2 text-gray-500 text-[10px]">
            Press Ctrl+Shift+D to toggle debug overlay
          </div>
        </div>
      )}

      {/* Controls panel */}
      {showControls && (
        <div className="fixed bottom-4 right-4 p-3 bg-white shadow-lg border border-gray-300 rounded-lg z-50">
          <div className="mb-2 text-sm font-semibold">Tree Controls</div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRenderMode('enhanced')}
              className={`px-2 py-1 text-xs rounded ${renderMode === 'enhanced' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Enhanced
            </button>

            <button
              onClick={() => setRenderMode('simple')}
              className={`px-2 py-1 text-xs rounded ${renderMode === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Simple
            </button>

            <button
              onClick={() => setRenderMode('none')}
              className={`px-2 py-1 text-xs rounded ${renderMode === 'none' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              None
            </button>

            <button
              onClick={toggleDebugMode}
              className={`px-2 py-1 text-xs rounded ${debugMode ? 'bg-amber-500 text-white' : 'bg-gray-200'}`}
            >
              Debug Info
            </button>

            <button
              onClick={toggleControls}
              className="px-2 py-1 text-xs rounded bg-gray-200"
            >
              Hide
            </button>
          </div>

          {error && (
            <div className="mt-2 p-2 text-xs bg-red-100 text-red-700 rounded">
              Error: {error.message}
            </div>
          )}
        </div>
      )}

      {!showControls && (
        <button
          onClick={toggleControls}
          className="fixed bottom-4 right-4 px-2 py-1 text-xs bg-white shadow-sm border border-gray-300 rounded opacity-50 hover:opacity-100 z-50"
        >
          Tree Controls
        </button>
      )}
    </>
  );
};

export default ClientTreeWrapper;