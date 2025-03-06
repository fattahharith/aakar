'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamic imports moved to this client component
const ClientTree = dynamic(() => import('./ClientTreeWrapper'), {
  ssr: false
});

const ClientComponentWrapper: React.FC = () => {
  return <ClientTree />;
};

export default ClientComponentWrapper;