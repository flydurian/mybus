
import React from 'react';

interface IconProps {
  className?: string;
}

const SubwayIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V6" />
    <path d="M16 6H8" />
    <path d="M15 13h-2" />
    <path d="m18 22-3-4" />
    <path d="m6 22 3-4" />
    <path d="M18 6c0-2.209-1.791-4-4-4H9a4 4 0 0 0-3.921 5.25" />
    <path d="M4 14a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4" />
    <path d="M4.25 10.079A4 4 0 0 1 8 6h8" />
  </svg>
);

export default SubwayIcon;
