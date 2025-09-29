import React from 'react';

interface IconProps {
  className?: string;
}

const CrosshairIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M22 12h-4" />
    <path d="M2 12h4" />
    <path d="M12 2v4" />
    <path d="M12 22v-4" />
  </svg>
);

export default CrosshairIcon;
