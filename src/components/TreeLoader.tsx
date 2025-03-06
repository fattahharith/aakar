'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR
const SimpleTree = dynamic(() => import('./SimpleTree'), { ssr: false });

// Simplified version
const TreeLoader: React.FC = () => {
  const [renderMode, setRenderMode] = useState<'simple' | 'none'>('simple');
  const [showControls, setShowControls] = useState(false);

  // Simplified controls toggle handler
  const toggleControls = () => {
    setShowControls(prev => !prev);
  };

  return (
    <>
      {/* Only render SimpleTree for now */}
      {renderMode === 'simple' && <SimpleTree />}

      {showControls && (
        <div className="fixed bottom-4 right-4 p-3 bg-white shadow-lg border border-gray-300 rounded-lg z-50">
          <div className="mb-2 text-sm font-semibold">Tree Controls</div>

          <div className="flex gap-2">
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
              onClick={toggleControls}
              className="px-2 py-1 text-xs rounded bg-gray-200"
            >
              Hide
            </button>
          </div>
        </div>
      )}

      {!showControls && (
        <button
          onClick={toggleControls}
          className="fixed bottom-4 right-4 px-2 py-1 text-xs bg-white shadow-sm border border-gray-300 rounded opacity-50 hover:opacity-100 z-50"
        >
          Show Controls
        </button>
      )}
    </>
  );
};

export default TreeLoader;