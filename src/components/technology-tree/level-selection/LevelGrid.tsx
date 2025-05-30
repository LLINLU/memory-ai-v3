
import React from 'react';
import { LevelColumn } from "./LevelColumn";

interface LevelGridProps {
  showLevel4: boolean;
  children: React.ReactNode;
}

export const LevelGrid: React.FC<LevelGridProps> = ({ showLevel4, children }) => {
  return (
    <div 
      className={`flex flex-row gap-6 mb-8 relative ${showLevel4 ? 'grid-cols-4' : 'grid-cols-3'}`}
      style={{ 
        display: 'grid',
        gridTemplateColumns: showLevel4 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
        gap: '1.5rem'
      }}
    >
      {children}
    </div>
  );
};
