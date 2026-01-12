
import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ config, size = 100, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      className={`rounded-full bg-[#E3F2FD] border-4 border-white shadow-lg ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* LAYER 0: Back Hair (For Long and Bob) */}
      {config.hairStyle === 'long' && (
         <path d="M45,90 L45,185 Q100,200 155,185 L155,90 Z" fill={config.hairColor} />
      )}
      {config.hairStyle === 'bob' && (
         <path d="M45,85 Q45,150 100,150 Q155,150 155,85 Z" fill={config.hairColor} />
      )}
      {config.hairStyle === 'puffs' && (
         <g>
            <circle cx="45" cy="65" r="30" fill={config.hairColor} />
            <circle cx="155" cy="65" r="30" fill={config.hairColor} />
         </g>
      )}

      {/* LAYER 1: Body */}
      <g transform="translate(50, 140)">
        <path 
          d="M0,60 Q0,0 50,0 T100,60 V100 H0 Z" 
          fill={config.clothing === 'labcoat' ? '#FFFFFF' : '#4A90E2'} 
        />
      </g>

      {/* LAYER 2: Head Base */}
      <circle cx="100" cy="90" r="50" fill={config.skinColor} />

      {/* LAYER 3: Facial Hair */}
      {config.facialHair === 'beard' && (
        <path d="M60,110 Q100,155 140,110 L140,120 Q100,165 60,120 Z" fill={config.hairColor} opacity="0.8" />
      )}
      {config.facialHair === 'mustache' && (
        <path d="M85,115 Q100,110 115,115 L115,118 Q100,115 85,118 Z" fill={config.hairColor} />
      )}

      {/* LAYER 4: Hair Styles (Based on Provided Image) */}
      {config.hairStyle === 'short' && (
        <path d="M50,85 Q50,25 100,25 T150,85 L150,95 Q100,80 50,95 Z" fill={config.hairColor} />
      )}
      {config.hairStyle === 'long' && (
        <path d="M50,85 Q50,25 100,25 T150,85 L150,110 Q140,100 130,105 Q100,85 70,105 Q60,100 50,110 Z" fill={config.hairColor} />
      )}
      {config.hairStyle === 'bob' && (
        <path d="M50,85 Q50,25 100,25 T150,85 L150,135 Q145,130 140,135 L140,85 Q100,75 60,85 L60,135 Q55,130 50,135 Z" fill={config.hairColor} />
      )}
      {config.hairStyle === 'puffs' && (
        <path d="M50,85 Q50,25 100,25 T150,85 L150,95 Q100,80 50,95 Z" fill={config.hairColor} />
      )}
      {config.hairStyle === 'fade' && (
        <path d="M55,75 Q100,35 145,75 L145,85 Q100,75 55,85 Z" fill={config.hairColor} />
      )}

      {/* LAYER 5: Eyes and Smile */}
      <circle cx="82" cy="95" r="4" fill="#000" />
      <circle cx="118" cy="95" r="4" fill="#000" />
      <path d="M85,120 Q100,132 115,120" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />

      {/* LAYER 6: Accessories */}
      {config.accessory === 'glasses' && (
        <g stroke="#333" strokeWidth="2.5" fill="none" opacity="0.8">
          <circle cx="82" cy="95" r="14" />
          <circle cx="118" cy="95" r="14" />
          <line x1="96" y1="95" x2="104" y2="95" />
        </g>
      )}
    </svg>
  );
};

export default Avatar;
