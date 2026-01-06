
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
      className={`rounded-full bg-blue-100 border-4 border-white shadow-lg ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* LAYER 0: Back Hair (Atrás da cabeça/corpo) */}
      {config.hairStyle === 'long' && (
         <path d="M45,90 L45,185 Q100,200 155,185 L155,90 Z" fill={config.hairColor} />
      )}
      {config.hairStyle === 'bob' && (
         <path d="M48,90 L48,155 Q100,165 152,155 L152,90 Z" fill={config.hairColor} />
      )}
      {config.hairStyle === 'puffs' && (
         <g>
            <circle cx="40" cy="70" r="35" fill={config.hairColor} />
            <circle cx="160" cy="70" r="35" fill={config.hairColor} />
         </g>
      )}

      {/* LAYER 1: Body */}
      <g transform="translate(50, 140)">
        <path 
          d="M0,60 Q0,0 50,0 T100,60 V100 H0 Z" 
          fill={config.clothing === 'labcoat' ? '#FFFFFF' : '#4A90E2'} 
          stroke="#000" 
          strokeWidth="1"
        />
        {config.clothing === 'labcoat' && (
          <path d="M50,0 L50,60" stroke="#E0E0E0" strokeWidth="1" />
        )}
      </g>

      {/* LAYER 2: Head Base */}
      <circle cx="100" cy="90" r="50" fill={config.skinColor} />

      {/* LAYER 3: Facial Hair */}
      {config.facialHair === 'beard' && (
        <path d="M60,110 Q100,150 140,110 L140,125 Q100,165 60,125 Z" fill={config.hairColor} opacity="0.9" />
      )}
      {config.facialHair === 'mustache' && (
        <path d="M80,110 Q90,105 100,110 Q110,105 120,110 L120,115 Q100,110 80,115 Z" fill={config.hairColor} />
      )}

      {/* LAYER 4: Frontal Hair / Fringe (Franja e Contorno do Rosto) */}
      {(config.hairStyle === 'short' || config.hairStyle === 'long' || config.hairStyle === 'puffs' || config.hairStyle === 'bob') && (
        <path 
          d="M50,90 Q50,30 100,30 T150,90 Q150,115 140,115 Q100,100 60,115 Q50,115 50,90 Z" 
          fill={config.hairColor} 
        />
      )}
      
      {config.hairStyle === 'fade' && (
        <path d="M55,70 Q100,35 145,70 L145,85 Q100,75 55,85 Z" fill={config.hairColor} />
      )}

      {/* LAYER 5: Face Features */}
      <circle cx="80" cy="95" r="4" fill="#000" />
      <circle cx="120" cy="95" r="4" fill="#000" />
      <path d="M85,115 Q100,125 115,115" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />

      {/* LAYER 6: Accessories */}
      {config.accessory === 'glasses' && (
        <g stroke="#333" strokeWidth="2" fill="none">
          <circle cx="80" cy="95" r="14" />
          <circle cx="120" cy="95" r="14" />
          <line x1="94" y1="95" x2="106" y2="95" />
        </g>
      )}
    </svg>
  );
};

export default Avatar;
