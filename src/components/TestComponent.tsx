'use client';

import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 p-3 bg-white shadow-lg border border-gray-300 rounded-lg z-50">
      <div className="mb-2 text-sm font-semibold">Test Component</div>
      <div className="text-xs">This is a test component to diagnose build errors</div>
    </div>
  );
};

export default TestComponent;
