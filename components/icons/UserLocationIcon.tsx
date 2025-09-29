import React from 'react';

interface IconProps {
  className?: string;
}

const UserLocationIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="7" fill="#2563EB" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="10" fill="#2563EB" fillOpacity="0.3" />
    </svg>
);

export default UserLocationIcon;
