
import React from 'react';

interface ThreeColumnsWideIconProps {
  className?: string;
}

export const ThreeColumnsWideIcon: React.FC<ThreeColumnsWideIconProps> = ({ className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="12" 
      height="12" 
      viewBox="0 0 12 12" 
      fill="none"
      className={className}
    >
      <path d="M3 1H1.5C1.22386 1 1 1.22386 1 1.5V10.5C1 10.7761 1.22386 11 1.5 11H3C3.27614 11 3.5 10.7761 3.5 10.5V1.5C3.5 1.22386 3.27614 1 3 1Z" fill="#1C4ED8"/>
      <path d="M6.75 1H5.25C4.97386 1 4.75 1.22386 4.75 1.5V10.5C4.75 10.7761 4.97386 11 5.25 11H6.75C7.02614 11 7.25 10.7761 7.25 10.5V1.5C7.25 1.22386 7.02614 1 6.75 1Z" fill="#1C4ED8"/>
      <path d="M10.5 1H9C8.72386 1 8.5 1.22386 8.5 1.5V10.5C8.5 10.7761 8.72386 11 9 11H10.5C10.7761 11 11 10.7761 11 10.5V1.5C11 1.22386 10.7761 1 10.5 1Z" fill="#1C4ED8"/>
    </svg>
  );
};
