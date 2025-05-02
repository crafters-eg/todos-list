import React from 'react';

interface TomadosIconProps {
  className?: string;
  size?: number;
}

export const TomadosIcon: React.FC<TomadosIconProps> = ({ 
  className = '', 
  size = 24 
}) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={size} 
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* Tomato shape */}
      <circle cx="50" cy="55" r="40" fill="currentColor" className="text-red-600 dark:text-red-500" />
      {/* Tomato stem */}
      <path 
        d="M50,15 C45,15 40,20 40,25 C40,30 45,35 50,35 C55,35 60,30 60,25 C60,20 55,15 50,15" 
        fill="currentColor" 
        className="text-green-600 dark:text-green-500"
      />
      {/* Checkmark */}
      <path 
        d="M35,55 L45,65 L65,45" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
        className="text-white dark:text-white"
      />
    </svg>
  );
};

export default TomadosIcon; 